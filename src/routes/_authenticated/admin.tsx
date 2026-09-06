import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Plus, Trash2, Pencil, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllProducts, type DbProduct } from "@/lib/store-api";
import { IMAGE_KEYS, imageFor } from "@/lib/product-images";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sunwood Mango Farm" },
      { name: "description", content: "Manage orders, products, customers and messages for Sunwood Mango Farm." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — Sunwood Mango Farm" },
      { property: "og:description", content: "Internal dashboard for the Sunwood Mango Farm team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type OrderRow = {
  id: string; order_no: number; customer_name: string; phone: string; address: string;
  city: string; province: string; postal: string; notes: string; payment_method: string;
  items: { name: string; weight: string; qty: number; unitPrice: number }[];
  subtotal: number; delivery: number; total: number; status: string; created_at: string;
};

type MessageRow = {
  id: string; name: string; email: string; phone: string; message: string;
  is_read: boolean; created_at: string;
};

const STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"];
const CATEGORIES = ["Chaunsa", "Sindhri", "Anwar Ratol", "Langra"];
const AVAILABILITY = ["In Stock", "Limited", "Pre-Order"];

const pkr = (n: number) => `PKR ${n.toLocaleString()}`;

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"dashboard" | "orders" | "products" | "messages">("dashboard");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      let { data } = await supabase
        .from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
      if (!data) {
        await supabase.rpc("claim_admin");
        const res = await supabase
          .from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
        data = res.data;
      }
      setIsAdmin(!!data);
    })();
  }, []);

  const orders = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as OrderRow[];
    },
  });

  const products = useQuery({
    queryKey: ["admin-products"],
    enabled: isAdmin === true,
    queryFn: fetchAllProducts,
  });

  const messages = useQuery({
    queryKey: ["admin-messages"],
    enabled: isAdmin === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as MessageRow[];
    },
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === false) {
    return (
      <main className="grid min-h-screen place-items-center bg-secondary/40 px-4 text-center">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl font-bold">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account isn't an administrator. Ask the farm owner to grant you access.
          </p>
          <button onClick={signOut} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Sign out
          </button>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ] as const;

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-lg font-bold">Sunwood</Link>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              Admin
            </span>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
        <div className="container-x flex gap-1 overflow-x-auto pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                )}
              >
                <Icon className="size-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="container-x py-8">
        {isAdmin === null && <p className="text-sm text-muted-foreground">Loading…</p>}
        {isAdmin && tab === "dashboard" && (
          <Dashboard orders={orders.data ?? []} products={products.data ?? []} messages={messages.data ?? []} />
        )}
        {isAdmin && tab === "orders" && <Orders rows={orders.data ?? []} reload={() => orders.refetch()} />}
        {isAdmin && tab === "products" && <Products rows={products.data ?? []} reload={() => products.refetch()} />}
        {isAdmin && tab === "messages" && <Messages rows={messages.data ?? []} reload={() => messages.refetch()} />}
      </div>
      <Toaster position="top-center" richColors />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function Dashboard({ orders, products, messages }: { orders: OrderRow[]; products: DbProduct[]; messages: MessageRow[] }) {
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "new").length;
  const customers = new Set(orders.map((o) => o.phone)).size;
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total orders" value={String(orders.length)} />
        <Stat label="Revenue" value={pkr(revenue)} />
        <Stat label="Pending orders" value={String(pending)} />
        <Stat label="Customers" value={String(customers)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={String(products.length)} />
        <Stat label="Active products" value={String(products.filter((p) => p.is_active).length)} />
        <Stat label="Messages" value={String(messages.length)} />
        <Stat label="Unread messages" value={String(unread)} />
      </div>
      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Latest orders</h2>
        <div className="mt-4 space-y-2">
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
              <span className="font-semibold">#{o.order_no} · {o.customer_name}</span>
              <span className="text-muted-foreground">{o.city}</span>
              <span className="font-bold">{pkr(o.total)}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs capitalize text-primary">{o.status}</span>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}

function Orders({ rows, reload }: { rows: OrderRow[]; reload: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const list = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error("Could not update the order");
    toast.success("Order updated");
    reload();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error("Could not delete the order");
    toast.success("Order deleted");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold capitalize",
              filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {list.map((o) => (
        <div key={o.id} className="rounded-3xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display text-lg font-bold">#{o.order_no} · {o.customer_name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()} · {o.phone} · {o.city}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{pkr(o.total)}</span>
              <select
                value={o.status}
                onChange={(e) => setStatus(o.id, e.target.value)}
                className="rounded-full border border-border bg-background px-3 py-2 text-xs capitalize"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setOpenId(openId === o.id ? null : o.id)} className="rounded-full border border-border px-3 py-2 text-xs">
                {openId === o.id ? "Hide" : "Details"}
              </button>
              <button onClick={() => remove(o.id)} aria-label="Delete order" className="rounded-full border border-border p-2 text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {openId === o.id && (
            <div className="mt-4 grid gap-4 border-t border-border pt-4 text-sm md:grid-cols-2">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Delivery</h4>
                <p className="mt-1">{o.address}</p>
                <p>{o.city}, {o.province} {o.postal}</p>
                <p className="mt-2">Payment: {o.payment_method === "cod" ? "Cash on delivery" : "Advance payment"}</p>
                {o.notes && <p className="mt-2 text-muted-foreground">Notes: {o.notes}</p>}
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Items</h4>
                <ul className="mt-1 space-y-1">
                  {o.items?.map((i, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{i.name} — {i.weight} × {i.qty}</span>
                      <span>{pkr(i.unitPrice * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold">
                  <span>Total (incl. delivery)</span><span>{pkr(o.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {list.length === 0 && <p className="text-sm text-muted-foreground">No orders here yet.</p>}
    </div>
  );
}

const emptyProduct = {
  name: "", tagline: "", price: 2000, category: "Chaunsa", availability: "In Stock",
  discount: 0, image_key: "chaunsa", hover_key: "sindhri", is_active: true, sort_order: 99,
};

function Products({ rows, reload }: { rows: DbProduct[]; reload: () => void }) {
  const [editing, setEditing] = useState<null | (typeof emptyProduct & { id?: string })>(null);

  const save = async () => {
    if (!editing) return;
    if (editing.name.trim().length < 2) return toast.error("Enter a product name");
    const payload = { ...editing };
    delete (payload as { id?: string }).id;
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error("Could not save the product");
    toast.success("Product saved");
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error("Could not delete the product");
    toast.success("Product deleted");
    reload();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setEditing({ ...emptyProduct })}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        <Plus className="size-4" /> Add product
      </button>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-3xl border border-border bg-card">
            <img src={imageFor(p.image_key)} alt={p.name} loading="lazy" width={600} height={400} className="h-40 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>
                </div>
                <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                  {p.is_active ? "Live" : "Hidden"}
                </span>
              </div>
              <div className="mt-2 text-sm font-bold">{pkr(p.price)} <span className="text-xs font-normal text-muted-foreground">/ 5 KG</span></div>
              <div className="text-xs text-muted-foreground">{p.category} · {p.availability}{p.discount ? ` · ${p.discount}% off` : ""}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing({ ...p })} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs">
                  <Pencil className="size-3" /> Edit
                </button>
                <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-destructive">
                  <Trash2 className="size-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-leaf-deep/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">{editing.id ? "Edit product" : "New product"}</h3>
              <button onClick={() => setEditing(null)} aria-label="Close"><X className="size-5" /></button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Input label="Tagline" value={editing.tagline} onChange={(v) => setEditing({ ...editing, tagline: v })} />
              <Input label="Price (5 KG, PKR)" type="number" value={String(editing.price)} onChange={(v) => setEditing({ ...editing, price: Number(v) || 0 })} />
              <Input label="Discount %" type="number" value={String(editing.discount)} onChange={(v) => setEditing({ ...editing, discount: Number(v) || 0 })} />
              <Select label="Category" value={editing.category} options={CATEGORIES} onChange={(v) => setEditing({ ...editing, category: v })} />
              <Select label="Availability" value={editing.availability} options={AVAILABILITY} onChange={(v) => setEditing({ ...editing, availability: v })} />
              <Select label="Photo" value={editing.image_key} options={[...IMAGE_KEYS]} onChange={(v) => setEditing({ ...editing, image_key: v })} />
              <Select label="Hover photo" value={editing.hover_key} options={[...IMAGE_KEYS]} onChange={(v) => setEditing({ ...editing, hover_key: v })} />
              <Input label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) || 0 })} />
              <label className="flex items-center gap-2 self-end text-sm">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="size-4 accent-primary" />
                Show on website
              </label>
            </div>
            <button onClick={save} className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
              Save product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Messages({ rows, reload }: { rows: MessageRow[]; reload: () => void }) {
  const toggleRead = async (m: MessageRow) => {
    const { error } = await supabase.from("messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (error) return toast.error("Could not update the message");
    reload();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error("Could not delete the message");
    reload();
  };

  return (
    <div className="space-y-3">
      {rows.map((m) => (
        <div key={m.id} className={cn("rounded-3xl border p-5", m.is_read ? "border-border bg-card" : "border-primary/40 bg-primary/5")}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-display font-bold">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.email} · {new Date(m.created_at).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleRead(m)} className="rounded-full border border-border px-3 py-1.5 text-xs">
                Mark as {m.is_read ? "unread" : "read"}
              </button>
              <button onClick={() => remove(m.id)} aria-label="Delete message" className="rounded-full border border-border p-2 text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm">{m.message}</p>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm capitalize focus:border-primary focus:outline-none"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
