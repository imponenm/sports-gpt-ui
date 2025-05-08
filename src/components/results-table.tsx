interface ResultsTableProps {
  results: Array<Record<string, any>>;
  pagination?: {
    page: number;
    rowsPerPage: number;
    totalRows: number;
    totalPages: number;
  };
}

export function ResultsTable({ results, pagination }: ResultsTableProps) {
  if (!results.length) return <p>No results to display.</p>;

  const headers = Object.keys(results[0]);

  return (
    <div className="overflow-x-auto mt-2.5 w-full">
      <table className="border-collapse w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            {headers.map((header, i) => (
              <th key={i} className="text-left p-2 whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-200">
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="text-left p-2">{String(row[header])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {pagination && (
        <div className="mt-2.5 text-sm text-gray-500">
          Showing {pagination.page * pagination.rowsPerPage + 1}-
          {Math.min((pagination.page + 1) * pagination.rowsPerPage, pagination.totalRows)} of {pagination.totalRows} results
        </div>
      )}
    </div>
  );
} 