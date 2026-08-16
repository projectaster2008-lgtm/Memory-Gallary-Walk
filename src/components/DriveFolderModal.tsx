import { useState } from 'react';
import { X, Folder, RefreshCw, LogIn, LogOut, Check, Sparkles, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { DEFAULT_FOLDER_ID, DEFAULT_FOLDER_URL, extractFolderId } from '../services/drive';
import { User } from 'firebase/auth';

interface DriveFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId: string;
  folderName: string;
  itemCount: number;
  user: User | null;
  isLoading: boolean;
  onConnectAndFetch: (folderId: string) => Promise<void>;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onLoadSamples: () => void;
}

export default function DriveFolderModal({
  isOpen,
  onClose,
  currentFolderId,
  folderName,
  itemCount,
  user,
  isLoading,
  onConnectAndFetch,
  onSignIn,
  onSignOut,
  onLoadSamples,
}: DriveFolderModalProps) {
  const [folderInput, setFolderInput] = useState(
    currentFolderId === DEFAULT_FOLDER_ID ? DEFAULT_FOLDER_URL : currentFolderId
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = async () => {
    setErrorMsg(null);
    const targetId = extractFolderId(folderInput);
    if (!targetId) {
      setErrorMsg('Please provide a valid Google Drive folder link or ID.');
      return;
    }

    try {
      await onConnectAndFetch(targetId);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch photos from Google Drive.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-gray-100 flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-display">
                Google Drive Photo Source
              </h3>
              <p className="text-xs text-gray-500">Sync memories directly into your 3D walk</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Google Account:</span>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{user.email}</span>
                <button
                  onClick={onSignOut}
                  className="text-red-500 hover:underline text-[11px] flex items-center gap-0.5"
                >
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign in with Google
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Loaded Memories:</span>
            <span className="font-bold text-gray-900">{itemCount} photos displayed</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Folder Name:</span>
            <span className="font-medium text-gray-700 truncate max-w-[200px]">{folderName}</span>
          </div>
        </div>

        {/* Folder Input Form */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Google Drive Folder Link / ID
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="Paste Google Drive folder URL or ID"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
            />
            <button
              onClick={() => setFolderInput(DEFAULT_FOLDER_URL)}
              className="text-[11px] text-emerald-600 hover:underline whitespace-nowrap px-2"
              title="Reset to requested folder"
            >
              Default Folder
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleApply}
            disabled={isLoading}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Fetching Photos...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Fetch Drive Photos</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onLoadSamples();
              onClose();
            }}
            className="w-full sm:w-auto py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
          >
            Load Sample Tour
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
