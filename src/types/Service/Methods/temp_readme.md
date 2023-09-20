# Full flow of communication:
1. dApp => wcjs.method()  
2. wcjs.method() => methodFunction()
3. methodFunction() => wallet (walletconnect || browser message)
4. wallet => methodFunction() (walletconnect || browser message)
5. methodFunction() => wcjs.method()
6. wcjs.method() => dApp

## Notes:
 - methodFunction is the same type as method, it just has optional params filled with defaults
 - Results should be the same no matter what wallet is used (wcjs should be a funnel)
