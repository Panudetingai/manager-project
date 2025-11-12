class LineService {
    private static channelAccessToken = process.env.LINE_MESSAGEAPI_CHANNEL_SECRET!;
    private static clientSecret = process.env.LINE_MESSAGEAPI_CLIENT_SECRET!;
    private static UserLineID = process.env.LINE_MESSAGEAPI_USER_ID!;
    private static clientId = process.env.LINE_MESSAGEAPI_CLIENT_ID!;
    
    constructor(){}


}

export { LineService };
