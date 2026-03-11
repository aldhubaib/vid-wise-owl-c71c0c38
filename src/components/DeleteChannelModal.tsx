interface DeleteChannelModalProps {
  open: boolean;
  channelName: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteChannelModal({ open, channelName, onClose, onDelete }: DeleteChannelModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg p-7 w-[380px] max-w-full">
        <div className="w-10 h-10 rounded-full bg-destructive/[0.12] border border-destructive/20 flex items-center justify-center text-base mb-4">
          ⚠
        </div>
        <h3 className="text-[15px] font-semibold mb-2">Remove Channel</h3>
        <p className="text-[13px] text-sensor leading-relaxed mb-6">
          Are you sure you want to remove <span className="text-foreground font-semibold">{channelName}</span>? All analysis data will be permanently deleted.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded bg-elevated border border-border text-sensor text-[13px] font-medium cursor-pointer transition-all hover:bg-border hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="py-1.5 px-4 rounded bg-destructive border border-destructive text-foreground text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-85"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
