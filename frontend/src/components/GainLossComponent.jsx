function GainLossComponent({ netGain = 0 }) {
    const isGain = netGain > 0;
    const isLoss = netGain < 0;

    return (
        <div className="max-w-md mx-auto bg-slate-700 rounded-2xl p-5 shadow-sm mt-5 ml-5 mr-5 border border-slate-950">
            <h3 className="text-white text-lg font-semibold mb-3">Net Gain/Loss</h3>
            <div className="text-center">
                <p className={`text-2xl font-bold ${isGain ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-white'}`}>
                    {isGain ? '+' : ''}{netGain.toFixed(2)}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                    {isGain ? 'Profit' : isLoss ? 'Loss' : 'Break Even'}
                </p>
            </div>
        </div>
    );
}

export default GainLossComponent;