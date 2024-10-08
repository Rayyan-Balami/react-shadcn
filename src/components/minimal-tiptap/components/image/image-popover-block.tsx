import { ToolbarButton } from '../toolbar-button'
import { Trash } from 'lucide-react'

const ImagePopoverBlock = ({ onRemove }: { onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onRemove(e)
  }

  return (
    <div className="flex h-10 overflow-hidden rounded bg-background p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton tooltip="Remove" onClick={handleRemove}>
          <Trash className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}

export { ImagePopoverBlock }
