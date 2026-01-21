# Avatar Integration Setup

## Installation Steps

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the new dependency (three.js):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## How It Works

The 3D avatar has been integrated into the Translator component:

1. **Text Input**: Type text in the text box
2. **Voice Input**: Click the microphone to speak
3. **Play Animation**: Click the "Play" button to make the avatar perform sign language
4. **Reset**: Clear all inputs and reset the avatar

The avatar will perform sign language animations for:
- Individual letters (A-Z)
- Common words (HELLO, HOME, TIME, PERSON, YOU, SLEEP)

## Files Modified/Created

- `frontend/src/components/Avatar3D.jsx` - New 3D avatar component
- `frontend/src/components/Translator.tsx` - Updated to integrate avatar
- `frontend/package.json` - Added three.js dependency
- `frontend/vite.config.js` - Configured to handle .glb files

## Notes

- The avatar uses the ybot model from the Models folder
- Animations are loaded from the Animations folder
- The avatar automatically performs sign language when you click "Play"
