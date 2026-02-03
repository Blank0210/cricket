function TransactionComponent() {
  const transactions = [
    {
      id: 1,
      match: "RR vs KKR",
      result: "Profit",
      amount: "+₹250",
    },
    {
      id: 2,
      match: "CSK vs MI",
      result: "Loss",
      amount: "-₹150",
    },
    {
      id: 3,
      match: "RCB vs SRH",
      result: "Profit",
      amount: "+₹400",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-5 ml-5 mr-5 overflow-x-auto">
      <table className="w-full text-white rounded-lg overflow-hidden">
        
        {/* Table Head */}
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-2 text-left border-b border-white">
              Match
            </th>
            <th className="px-4 py-2 text-left border-b border-white">
              Profit / Loss
            </th>
            <th className="px-4 py-2 text-left border-b border-white">
              Amount
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="odd:bg-slate-700 even:bg-slate-600"
            >
              <td className="px-4 py-2 border-b border-white">
                {tx.match}
              </td>

              <td
                className={`px-4 py-2 border-b border-white font-medium ${
                  tx.result === "Profit"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {tx.result}
              </td>

              <td className="px-4 py-2 border-b border-white">
                {tx.amount}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default TransactionComponent;
