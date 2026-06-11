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
      <option value="10">12</option>
      <option value="24">24</option>
      <option value="64">64</option>
    </select>
  );
}