import { useState, useRef } from 'react';
import { Camera, Upload, ArrowRight, Folder, Sparkles, LogIn, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { User } from 'firebase/auth';
import { DEFAULT_FOLDER_ID, DEFAULT_FOLDER_URL, extractFolderId } from '../services/drive';

interface IntroScreenProps {
  user: User | null;
  isLoading: boolean;
  onConnectDrive: (folderId: string) => Promise<void>;
  onExploreSamples: (userAvatar?: string) => void;
  onSignIn: () => Promise<void>;
}

export default function IntroScreen({
  user,
  isLoading,
  onConnectDrive,
  onExploreSamples,
  onSignIn,
}: IntroScreenProps) {
  const [folderInput, setFolderInput] = useState(DEFAULT_FOLDER_URL);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      console.error('Camera access denied', e);
      setUseCamera(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, w, h);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setAvatarPreview(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setUseCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFetchDrive = async () => {
    setErrorMsg(null);
    const targetFolderId = extractFolderId(folderInput);
    try {
      if (!user) {
        await onSignIn();
      }
      await onConnectDrive(targetFolderId);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Could not fetch Google Drive folder photos.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-xl mx-auto p-6 font-sans text-center overflow-y-auto">
      {/* Top Header */}
      <div className="pt-8 pb-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Sphere & Gallery Walk</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-gray-900 leading-none mb-3">
          Memory Gallery Walk
        </h1>
        <p className="text-sm text-gray-500 max-w-md">
          Immerse yourself in a 3D spherical world of memories synced with your Google Drive photos.
        </p>
      </div>

      {/* Main Connection Box */}
      <div className="w-full bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5 my-auto">
        {/* Google Drive Folder Target */}
        <div className="text-left space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-emerald-600" />
              <span>Target Google Drive Folder</span>
            </label>
            <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
              Preset Ready
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="Paste Google Drive folder URL or ID"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-mono text-gray-800 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-gray-900 transition-all"
            />
          </div>
          <p className="text-[11px] text-gray-400">
            Fetching from folder <code className="text-gray-600">{extractFolderId(folderInput)}</code>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs text-left">
            {errorMsg}
          </div>
        )}

        {/* Primary Action Button: Connect & Fetch */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleFetchDrive}
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading Google Drive Photos...</span>
              </>
            ) : user ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Fetch Folder Memories</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                {/* Official Google Sign-in SVG icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Connect Google Drive & Start Walk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Alternative: Sample Gallery Tour */}
          <button
            onClick={() => onExploreSamples(avatarPreview || undefined)}
            className="w-full py-3 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
          >
            Explore Sample 3D Gallery First
          </button>
        </div>

        {/* Optional Avatar Photo Section */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <Camera className="w-4 h-4" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-800">Personalize Your Walk</p>
              <p className="text-[10px] text-gray-400">Add an optional traveler photo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startCamera}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-xs"
              title="Take photo with camera"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-xs"
              title="Upload photo"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Camera Modal Popup if active */}
        {useCamera && (
          <div className="mt-4 p-4 border border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center gap-3">
            <video ref={videoRef} className="w-48 aspect-[3/4] object-cover rounded-xl border" playsInline muted />
            <div className="flex items-center gap-3">
              <button
                onClick={takePhoto}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold"
              >
                Capture
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Footer Notice */}
      <div className="py-4 text-[10px] text-gray-400 max-w-sm flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span>Photos are read securely via Google Drive readonly API access.</span>
      </div>
    </div>
  );
}
