export default function SavingsTransactions({ params }: { params: { savingId: string } }) {
  return (
    <main className="md:px-10 px-4">
      <h1>{params.savingId}</h1>
    </main>
  );
}
