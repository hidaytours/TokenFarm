import './App.css';

function App() {
  let currentAccount;
  return (
    <div className="h-screen w-screen flex-col flex">
      <div className="text-ellipsis h-20 w-full flex items-center justify-between bg-black">
        <div className="flex items-center">
          <img src={'farmer.png'} alt="Logo" className="px-5" />;
          <div className="text-white text-3xl">ETH Yield Farm</div>
        </div>
        {currentAccount === '' ? (
          <button
            className="text-white mr-10 px-3 py-1 text-2xl border-solid border-2 border-white flex items-center justify-center"
            onClick={() => { }}
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-gray-400 text-lg pr-5">{ }</div>
        )}
      </div>
      <div className=" w-screen h-full flex-1 items-center justify-center flex flex-col">
        <div className="w-1/2 h-1/3 flex justify-center items-center pt-36">
          <div className="w-1/2 h-1/2 flex justify-center items-center flex-col">
            <div>Staking Balance</div>
            <div>0 DAI</div>
          </div>
          <div className="w-1/2 h-1/2 flex justify-center items-center flex-col">
            <div>Reward Balance</div>
            <div>DAPP</div>
          </div>
        </div>
        <div className="h-1/2 w-1/2 flex justify-start items-center flex-col">
          <div className="flex-row flex justify-between items-end w-full px-20">
            <div className="text-xl">Stake Tokens</div>
            <div className="text-gray-300">
              Balance: 0 DAI
            </div>
          </div>
          <div className="felx-row w-full flex justify-between items-end px-20 py-3">
            <input
              placeholder="0"
              className="flex items-center justify-start border-solid border-2 border-black w-full h-10 pl-3"
              type="text"
              id="stake"
              name="stake"
              value={1}
              onChange={() => { }}
            />
            <div className="flex-row flex justify-between items-end">
              <img src={'dai.png'} alt="Logo" className="px-5 h-9 w-18" />
              <div>DAI</div>
            </div>
          </div>
          <div
            className="w-full h-14 bg-blue-500 text-white m-3 flex justify-center items-center"
            onClick={() => { }}
          >
            Stake!
          </div>
          <div className="text-blue-400" onClick={() => { }}>
            UN-STAKE..
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
}

export default App;