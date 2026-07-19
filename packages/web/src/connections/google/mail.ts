import type { Mail, MailCapability } from '../../capability/mail'

const GMAIL_API_ROOT = 'https://gmail.googleapis.com/gmail/v1/users/me'

export class GoogleMailCapability implements MailCapability {
  constructor(private readonly getRequestHeaders: () => Record<string, string>) {}

  async listMails() {
    return this.list('labelIds=INBOX')
  }

  async listAllMails() {
    return this.list('')
  }

  async archiveMail(id: string) {
    await fetch(`${GMAIL_API_ROOT}/messages/${id}/modify`, {
      method: 'POST',
      headers: {
        ...this.getRequestHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ removeLabelIds: ['INBOX'] }),
    })
  }

  async trashMail(id: string) {
    await fetch(`${GMAIL_API_ROOT}/messages/${id}/trash`, {
      method: 'POST',
      headers: this.getRequestHeaders(),
    })
  }

  private async list(query: string) {
    const listResponse = await fetch(
      `${GMAIL_API_ROOT}/messages?maxResults=10${query ? `&${query}` : ''}`,
      {
        headers: this.getRequestHeaders(),
      },
    )
    const { messages } = (await listResponse.json()) as {
      messages: Array<{
        id: string
      }>
    }

    return Promise.all(
      messages.map(async ({ id }): Promise<Mail> => {
        const messageResponse = await fetch(
          `${GMAIL_API_ROOT}/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
          {
            headers: this.getRequestHeaders(),
          },
        )

        const message = (await messageResponse.json()) as {
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
        }
      }),
    )
  }
}
