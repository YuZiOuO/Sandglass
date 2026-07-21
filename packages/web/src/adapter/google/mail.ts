import type { Mail, MailCapability } from '../../capability/mail'

const GMAIL_API_ROOT = 'https://gmail.googleapis.com/gmail/v1/users/me'

export class GoogleMailCapability implements MailCapability {
  constructor(
    private readonly request: (url: string | URL, init?: RequestInit) => Promise<Response>,
  ) {}

  async listMails() {
    return this.list('labelIds=INBOX')
  }

  async listAllMails() {
    return this.list('')
  }

  async archiveMail(id: string) {
    await this.request(`${GMAIL_API_ROOT}/messages/${id}/modify`, {
      method: 'POST',
      body: JSON.stringify({ removeLabelIds: ['INBOX'] }),
    })
  }

  async unarchiveMail(id: string) {
    await this.request(`${GMAIL_API_ROOT}/messages/${id}/modify`, {
      method: 'POST',
      body: JSON.stringify({ addLabelIds: ['INBOX'] }),
    })
  }

  async trashMail(id: string) {
    await this.request(`${GMAIL_API_ROOT}/messages/${id}/trash`, {
      method: 'POST',
    })
  }

  async untrashMail(id: string) {
    await this.request(`${GMAIL_API_ROOT}/messages/${id}/untrash`, {
      method: 'POST',
    })
  }

  private async list(query: string) {
    const listResponse = await this.request(
      `${GMAIL_API_ROOT}/messages?maxResults=10${query ? `&${query}` : ''}`,
    )
    const { messages } = (await listResponse.json()) as {
      messages: Array<{
        id: string
      }>
    }

    return Promise.all(
      messages.map(async ({ id }): Promise<Mail> => {
        const messageResponse = await this.request(
          `${GMAIL_API_ROOT}/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
        )

        const message = (await messageResponse.json()) as {
          labelIds: string[]
          snippet: string
          payload: {
            headers: Array<{
              name: string
              value: string
            }>
          }
        }
        const headers = message.payload.headers

        return {
          id,
          title: headers.find((header) => header.name === 'Subject')!.value,
          content: `${headers.find((header) => header.name === 'From')!.value}\n\n${message.snippet}`,
          archived: !message.labelIds.includes('INBOX'),
        }
      }),
    )
  }
}
