interface minimumAttachment {
  name: string
}

interface controlledAttachment {
  id: string
}

interface Attachment extends minimumAttachment, controlledAttachment {}

export type { minimumAttachment, controlledAttachment, Attachment }
