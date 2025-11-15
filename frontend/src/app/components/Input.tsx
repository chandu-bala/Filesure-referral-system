interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        {...props}
        className="border p-2 rounded bg-white text-black"
      />
    </div>
  );
}
