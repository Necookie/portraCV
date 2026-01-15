from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from transformers import AutoModelForImageSegmentation
from torchvision import transforms
from PIL import Image
import torch
import io
import uvicorn

app = FastAPI()

# 1. CORS: Allow React to talk to Python
# In production, for better security, you might replace "*" with your specific frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. LOAD MODEL
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Loading Model on {device}...")
model = AutoModelForImageSegmentation.from_pretrained('ZhengPeng7/BiRefNet', trust_remote_code=True)
model.to(device)
model.eval()
print("Model Ready!")

def process_image(image_bytes, bg_color_hex):
    # Load Image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    original_size = image.size
    
    # Preprocess
    transform_image = transforms.Compose([
        transforms.Resize((1024, 1024)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    input_tensor = transform_image(image).unsqueeze(0).to(device)

    # Inference
    with torch.no_grad():
        preds = model(input_tensor)[-1].sigmoid().cpu()
    
    # Process Mask
    pred_mask = preds[0].squeeze()
    mask_pil = transforms.ToPILImage()(pred_mask)
    mask_pil = mask_pil.resize(original_size, Image.BILINEAR)

    # Composite Background
    if bg_color_hex == "transparent":
        result = image.convert("RGBA")
        result.putalpha(mask_pil)
    else:
        bg_color = tuple(int(bg_color_hex.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
        background = Image.new("RGB", original_size, bg_color)
        result = Image.composite(image, background, mask_pil)
        
    # Save to buffer
    img_byte_arr = io.BytesIO()
    result.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...), color: str = Form(...)):
    image_bytes = await file.read()
    result_bytes = process_image(image_bytes, color)
    return Response(content=result_bytes, media_type="image/png")

if __name__ == "__main__":
    # CRITICAL CHANGE: Hugging Face Spaces expects the app to run on port 7860
    uvicorn.run(app, host="0.0.0.0", port=7860)