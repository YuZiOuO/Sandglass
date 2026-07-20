import type { Capability } from '@/interfaces'

export interface MailCapability extends Capability {
  listMails: () => Promise<readonly Mail[]>
  listAllMails: () => Promise<readonly Mail[]>
  archiveMail: (id: string) => Promise<void>
  unarchiveMail: (id: string) => Promise<void>
  trashMail: (id: string) => Promise<void>
  untrashMail: (id: string) => Promise<void>
}

export type Mail = {
  id: string
  title: string
  content: string
  archived: boolean
}
