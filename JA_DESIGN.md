# Webmax Protocol
Wallet Connect with Web Wallets and more

## Summary
WebウォレットがDappと接続するためのプロトコルを提案します。  
このプロトコルは、シンプルなため、様々な応用が可能です。

## Abstract
Webページとして提供されるウォレット(Webウォレット)と、Dappが直接通信して接続できるプロトコルを提案します。  
このプロトコルは、WebウォレットとDappの間で、EIP1193ライクなやり取りを行えるように、通信方法とデータ構造を定義します。  
本質的にこのプロトコルには、Webウォレットと別のタブで動作するWebページが、規格に従って通信するためのプロトコルです。  
そのため、様々な拡張や応用が可能です。詳細はのちのセクションで述べます。

## Specification

### Definitions
- `Web Wallet`: Webページとして提供されるウォレット
- `Dapp`: Web Walletと接続されるWebページ
- `Child Window`: Dappが開く、Web Walletのウィンドウ。一般的にPopupやIframe。

### Core Concepts
このプロトコルの基本的な考え方は、DappからWebウォレットを、EIP1193と互換性のあるインターフェースを介して操作できるようにすることです。ついでにEVM系以外のチェーンでも利用できるよう、汎用的に設計したほうが良いいでしょう。

Child WindowとDappの間でのクロスオリジン通信は、[postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)をと[MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)利用して行います。

ただし、Child WindowとDapp間は、Child Windowが開かれている間のみ通信できますが、ウォレットは署名時などのユーザーの承認が必要な操作が必要なタイミングでのみ、開かれることが一般的です。そのため、アカウント情報などの読み取り系の操作は、いくつかの工夫が必要です。

### Message Format

**Extended JSON-RPC**  
Ethereumなどのブロックチェーンの多くのウォレットでは、各操作がJSON-RPCのメソッドとして提供されています。
これらを参考にし、以下のようなJSON-RPCを継承したメッセージフォーマットを定義します。

```typescript
export type AbstractRequest<NS extends string = string, Params = unknown> = {
	id: number;
	namespace: NS | ChainedNamespace<NS>;
	method: string;
	params: Params;
	metadata?: unknown;
};

export type AbstractSuccessResponse<NS extends string = string, Result = unknown> = {
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
各メソッドごとに、Namespaceが必須で、メソッドのグループを定義します。
Namespaceは各リクエストごとに含める必要があり、ChainIDの情報も含めることができます。

```typescript
type ChainId = string | number
type Namespace = "eip155" | "webmax"
type ChainedNamespace = `${Namespace}:${ChainId}`;
```

**Window Handling**
ウォレットがレスポンスを返した後、ウォレットのWindowをどのように扱うかを指定します。
ウォレット側でエラーメッセージを表示したい場合などに有効です。

```typescript
type WindowHandling = "keep" | "close";
```