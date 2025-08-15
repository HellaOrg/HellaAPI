import arkprts
import asyncio
import json
import os
import sys
from dotenv import load_dotenv


async def main() -> None:
    endpoint = 'crisisV2/getInfo'
    data = ''

    try:
        load_dotenv()
        auth = arkprts.YostarAuth("en")
        await auth.login_with_token(os.getenv('YOSTAR_UID'), os.getenv('YOSTAR_TOKEN'))
        client = arkprts.Client(auth=auth, assets=False)

        payload = f'{{}}'
        data = await client.auth.auth_request(endpoint, json=payload and json.loads(payload), handle_errors=False)
    finally:
        await client.auth.network.close()
        json.dump(data, sys.stdout, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    asyncio.run(main())
