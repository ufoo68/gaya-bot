import * as Lambda from 'aws-lambda'
import * as Line from '@line/bot-sdk'
import * as Types from '@line/bot-sdk/lib/types'
import * as PubNub from 'pubnub'
import { buildReplyText } from 'line-message-builder'

const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN!
const channelSecret = process.env.CHANNEL_SECRET!

const config: Line.ClientConfig = {
  channelAccessToken,
  channelSecret,
}
const client = new Line.Client(config)
const pubnub = new PubNub({
  publishKey: 'pub-c-37dbbd57-d924-460b-8570-c3268d8758e7',
  subscribeKey: 'sub-c-c27c690e-15b5-11eb-ae19-92aa6521e721',
})

async function eventHandler(event: Types.MessageEvent): Promise<any> {
  if (event.type !== 'message' || event.message.type !== 'text' || !event.source.userId) {
    return null
  }
  await pubnub.publish({
    message: event.message.text,
    channel: 'gaya',
  })
  return client.replyMessage(event.replyToken, buildReplyText('ガヤを送ったよ'))
}

export const handler: Lambda.APIGatewayProxyHandler = async (proxyEevent: Lambda.APIGatewayEvent) => {
  const signature = proxyEevent.headers['X-Line-Signature']
  if (!Line.validateSignature(proxyEevent.body!, channelSecret, signature)) {
    throw new Line.SignatureValidationFailed('signature validation failed', signature)
  }

  const body: Line.WebhookRequestBody = JSON.parse(proxyEevent.body!)
  await Promise
    .all(body.events.map(async (event) => eventHandler(event as Types.MessageEvent)))
    .catch((err) => {
      console.error(err.Message)
      return {
        statusCode: 500,
        body: 'Error',
      }
    })
  return {
    statusCode: 200,
    body: 'OK',
  }
}