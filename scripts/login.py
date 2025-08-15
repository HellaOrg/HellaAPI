import arkprts
import asyncio
import os
from dotenv import load_dotenv


async def main() -> None:
    load_dotenv()
    auth = arkprts.YostarAuth("en")
    await auth.send_email_code(os.getenv('YOSTAR_EMAIL'))
    print("Enter code from email:")
    code = input()
    uid, token = await auth.get_token_from_email_code(os.getenv('YOSTAR_EMAIL'), code)
    print("uid: " + uid)
    print("token: " + token)
    await auth.network.close()

if __name__ == "__main__":
    asyncio.run(main())
