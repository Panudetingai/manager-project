class LineService {
  private static channelAccessToken =
    process.env.LINE_MESSAGEAPI_CHANNEL_SECRET!;
  private static clientSecret = process.env.LINE_MESSAGEAPI_CLIENT_SECRET!;
  private static UserLineID = process.env.LINE_MESSAGEAPI_USER_ID!;
  private static clientId = process.env.LINE_MESSAGEAPI_CLIENT_ID!;

  constructor() {}

  public static async pushMessageToBoradcast(message: string) {
    const url = `${process.env.LINE_MESSAGEAPI_URL}/message/push`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        to: this.UserLineID,
        messages: [
          {
            type: "text",
            text: "Hello Piano" + message,
          },
        ],
      }),
    });

    console.log("Response Status:", JSON.stringify(await response.json()));

    return response;
  }

  public static async replyMessage(
    replyToken: string,
    messages: Array<{ type: string; text: string }>
  ) {
    const url = `${process.env.LINE_MESSAGEAPI_URL}/message/reply`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages,
      }),
    });

    console.log("Response Status:", JSON.stringify(await response.json()));

    return response;
  }
}

export { LineService };
