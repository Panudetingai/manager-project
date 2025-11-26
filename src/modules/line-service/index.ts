import { LineService } from "./line.service";

async function main() {
  const response = await LineService.pushMessageToBoradcast(
    "Test broadcast message"
  );
  console.log("Response Status:", response.status);
}

main();
