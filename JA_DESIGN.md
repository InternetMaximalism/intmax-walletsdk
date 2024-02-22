# Webmax Protocol Proposal

Wallet Connect with Web Wallets and more

## Summary

Web ウォレットが Dapp と接続するためのプロトコルを提案します。  
このプロトコルは、シンプルなため、様々な応用が可能です。

## Abstract

Web ページとして提供されるウォレット(Web ウォレット)と、Dapp が直接通信して接続できるプロトコルを提案します。  
このプロトコルは、Web ウォレットと Dapp の間で、EIP1193 ライクなやり取りを行えるように、通信方法とデータ構造を定義します。  
本質的にこのプロトコルには、Web ウォレットと別のタブで動作する Web ページが、規格に従って通信するためのプロトコルです。  
そのため、様々な拡張や応用が可能です。詳細は、後述の Use Cases を参照してください。

## Specification

### Definitions

- `Web Wallet`: Web ページとして提供されるウォレット
- `Dapp`: Web Wallet と接続される Web ページ
- `Child Window`: Dapp が開く、Web Wallet のウィンドウ。一般的に Popup や Iframe。

### Core Concepts

このプロトコルの基本的な考え方は、Dapp から Web ウォレットを、EIP1193 と互換性のあるインターフェースを介して操作できるようにすることです。ついでに EVM 系以外のチェーンでも利用できるよう、汎用的に設計したほうが良いいでしょう。

Child Window と Dapp の間でのクロスオリジン通信は、[postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)をと[MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)利用して行います。

ただし、Child Window と Dapp 間は、Child Window が開かれている間のみ通信できますが、ウォレットは署名時などのユーザーの承認が必要な操作が必要なタイミングでのみ、開かれることが一般的です。そのため、アカウント情報などの読み取り系の操作は、いくつかの工夫が必要です。

### Summary of Protocol Flow

ある Dapp から、Web ウォレットに対して、eth_requestAccounts などのメソッドを呼び出すときの流れを以下に示します。

```mermaid
sequenceDiagram
actor user as User
participant dapp as dApp
participant wallet as Wallet (Popup)
	user ->> dapp: Click "Connect"
	dapp ->> wallet: open wallet with window.open
	Note right of wallet: Rendering wallet
	wallet -->> dapp: webmax_ready response
	Note over dapp,wallet: Send a message after rendering is complete
	dapp ->>+ wallet: Some request Message
	Note right of wallet: Show approve Request for User
	user ->> wallet: check and approve reqeuest
	wallet -->>- dapp: return Response Message
	dapp -->> user: DONE!!!
```

1. ユーザーは dApp で「Connect」ボタンをクリック
2. dApp はウォレットを開くために `window.open` を使用
3. ウォレットが開かれ、初期化される
4. 初期化後、ウォレットは `webmax_ready` メッセージを送信
5. 初期化を確認後、dApp は`eth_requestAccounts` などのメッセージを送信
6. ウォレットはユーザーにリクエストを表示
7. ユーザーはリクエストを確認し、承認する
8. ウォレットはレスポンスを送信
9. dApp はレスポンスを受け取り、Window を閉じたりする

### Message Format

**Extended JSON-RPC**  
Ethereum などのブロックチェーンの多くのウォレットでは、各操作が JSON-RPC のメソッドとして提供されています。
これらを参考にし、以下のような JSON-RPC を継承したメッセージフォーマットを定義します。

```typescript
export type AbstractRequest<NS extends string = string, Params = unknown> = {
  id: number;
  namespace: NS | ChainedNamespace<NS>;
  method: string;
  params: Params;
  metadata?: unknown;
};

export type AbstractSuccessResponse<
  NS extends string = string,
  Result = unknown
> = {
  id: number;
  namespace: NS | ChainedNamespace<NS>;
  method: string;
  windowHandling: WindowHandling;
  result: Result;
};

export type AbstractErrorResponse<NS extends string = string> = {
  id: number;
  namespace: NS | ChainedNamespace<NS>;
  method: string;
  windowHandling: WindowHandling;
  error: { code: number; message: string };
};

export type AbstractResponse<NS extends string = string, Result = unknown> =
  | AbstractSuccessResponse<NS, Result>
  | AbstractErrorResponse<NS>;
```

**Namespace**  
各メソッドごとに、Namespace が必須で、メソッドのグループを定義します。
Namespace は各リクエストごとに含める必要があり、ChainID の情報も含めることができます。

```typescript
type ChainId = string | number;
type Namespace = "eip155" | "webmax";
type ChainedNamespace = `${Namespace}:${ChainId}`;
```

**Window Handling**
ウォレットがレスポンスを返した後、ウォレットの Window をどのように扱うかを指定します。
ウォレット側でエラーメッセージを表示したい場合などに有効です。

```typescript
type WindowHandling = "keep" | "close";
```

### Error Codes

エラーコードは EIP1193 を継承し、さらに下記のようなエラーコードを追加します。
TODO: その他のエラーコードを追加する

| Status code | Name               | Description                                                     |
| ----------- | ------------------ | --------------------------------------------------------------- |
| 5001        | Chain not Suppoted | ChainID specified in namespace, but wallet does not support it. |
| 5100        | Popups blocked     | For some reason the wallet could not be opened.                 |

### Methods Types

Webmax プロトコルでは、JSON-RPC のメソッドに、三つの種類を定義します。

- **notice**: ウォレットからの通知メッセージ
- **approval**: ウォレットに対してのリクエストするメソッド
- **readonly**: dapp 側で解決する、読み取り系のメソッド

**notice**  
少し特殊なメソッドの種類で、ウォレットからの通知を表すメソッドです。
このタイプのメソッドは、ウォレットで暗黙的に発火されて、dapp 側に通知されます。
基本的に、webmax プロトコルで定義されいるメソッド以外で、このタイプを使用することはありません。

**approval**  
署名などのユーザーの承認が必要なメソッドです。

**readonly**  
`eip155/eth_accounts`などの読み取り系のメソッドです。基本的に dapp 側の SDK でキャッシュされ、ウォレットにリクエストすることはありません。しかし、ただのメソッドではあるため、ウォレット側でハンドリングすることも可能です。

### Webmax Methods

**webmax_ready**  
ウォレットが初期化され、dapp から通信が可能になったことを通知するメソッドです。

- **Params**: なし
- **Result**: `WebmaxReadyResult`

```typescript
export type WebmaxReadyResult = {
  supportedNamespaces: Namespace[];
  supportedChains: ChainedNamespace[];
};
```

**webmax_connect**  
ユーザーにウォレットとの接続を要求するメソッドです。

- **Params**: なし
- **Result**: `WebmaxConnectResult`

```typescript
type WebmaxConnectResult = {
  supportedNamespaces: Namespace[];
  supportedChains: ChainedNamespace[];
  accounts: {
    eip155: EthereumAddress[];
  };
};
```

### Eth Approval Methods

下記のメソッドは、dapp からウォレットにユーザーの承認を要求するメソッドです。各 EIP のスキーマを継承します。

- **eth_requestAccounts** - EIP1102
- **eth_sign** - EIP1474
- **eth_signTypedData_v4** - EIP712
- **eth_signTransaction** - EIP1474
- **eth_sendTransaction**- EIP1474
- **wallet_addEthereumChain** - EIP3085
- **wallet_watchAsset** - EIP747

### Eth Readonly Methods

下記のメソッドは、dapp 側の SDK で解決されることを想定しています。ウォレットにリクエストすることはありません。
readonly という命名は後々変更される可能性があります。

- **eth_accounts** - EIP1193
- **eth_chainId** - EIP1193
- **wallet_switchEthereumChain** - EIP3085

## Note: EIP1193 Event Handling

Webmax プロトコルは、その特定からイベントの伝達が困難です。そのため、EIP1193 のイベントについては、dapp 側の SDK で解決することを想定しています。

## Use Cases

以下は、Webmax プロトコルの利用例です。しかし、Wembax プロトコルはただの通信規格であり、様々な応用が可能です。

### Connect with Web Wallet

Dapp に Webmax の DappSDK を組み込むことで、Webmax に対応した Web ウォレットと接続することが出来ます。
これは、WalletConnect のようなプロトコルと同様の利用方法です。

### Bookmarklet Wallet

ブックマークを利用することで、Webmax の DappSDK のコードを、既存の Dapp に挿入することが出来ます。
これにより、既存のほぼすべての Dapp で、Metamask と同じように Web ウォレットを利用することが出来ます。
とても奇妙ですが、実際に動作することを確認しています。
※CSP などのセキュリティポリシーにより、一部の Dapp で利用できない場合があります。

### Webmax Wallet Luncher

前述のとおり、ブックマークレットウォレットは、UX などの問題があります。
そのため、Webmax 対応の Web ウォレットを管理する、ランチャーのような機能を持った拡張機能を一つ作成することで、
Webmax 対応の Web ウォレットを、Metamask と同じように利用することが出来ます。
これは、Web ウォレットの飛躍と普及につながると確信しており、現在開発中です。
