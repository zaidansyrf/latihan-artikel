"use client";

export default function PaginationLimitSelect({
  safeLimit,
}: {
  safeLimit: number;
}) {
  return (
    <select
      name="limit"
      defaultValue={safeLimit}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      <option value="3">3</option>
      <option value="40">40</option>
      <option value="80">80</option>
    </select>
  );
}