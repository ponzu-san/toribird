import Button from "@/components/ui/Button";

type DeleteButtonProps = {
  label: string;
  action: (formData: FormData) => void | Promise<void>;
};

export default function DeleteButton({ label, action }: DeleteButtonProps) {
  return (
    <form action={action}>
      <Button type="submit" variant="secondary" className="!border-rose-300 !text-rose-700">
        {label}を削除する
      </Button>
    </form>
  );
}
