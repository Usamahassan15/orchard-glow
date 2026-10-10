import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Plus, Trash2, Pencil, X, ShieldCheck, ExternalLink, FileText, HelpCircle, Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllProducts, type DbProduct, type PostRow, type FaqRow } from "@/lib/store-api";
import { IMAGE_KEYS, imageFor } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { listAdmins, addAdmin, removeAdmin } from "@/lib/admins.functions";

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
  const [tab, setTab] = useState<"dashboard" | "orders" | "products" | "messages" | "blog" | "faqs" | "admins">("dashboard");
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
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "admins", label: "Edit Admins", icon: ShieldCheck },
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
          <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <ExternalLink className="size-4" /> View site
          </a>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
            <LogOut className="size-4" /> Sign out
          </button>
          </div>
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
        {isAdmin && tab === "blog" && <Blog />}
        {isAdmin && tab === "faqs" && <Faqs />}
        {isAdmin && tab === "admins" && <Admins />}
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
              <div className="rounded-2xl bg-secondary/50 p-4">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Customer Information</h4>
                <dl className="mt-3 space-y-2">
                  <Row label="Full Name" value={o.customer_name} />
                  <Row label="Phone Number" value={o.phone} />
                  <Row label="Complete Address" value={o.address} />
                  <Row label="City" value={o.city} />
                  <Row label="Province" value={o.province || "—"} />
                  <Row label="Postal Code" value={o.postal || "—"} />
                  <Row label="Notes" value={o.notes || "—"} />
                </dl>
                <h4 className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Payment Method</h4>
                <p className="mt-1 font-semibold">
                  {o.payment_method === "cod" ? "Cash on Delivery" : "Advance Payment (Bank / EasyPaisa)"}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary/50 p-4">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Order Items</h4>
                <ul className="mt-3 space-y-1.5">
                  {o.items?.map((i, idx) => (
                    <li key={idx} className="flex justify-between gap-3">
                      <span>{i.name} — {i.weight} × {i.qty}</span>
                      <span className="shrink-0">{pkr(i.unitPrice * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1.5 border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span><span>{pkr(o.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span><span>{pkr(o.delivery)}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-display text-base font-bold">
                    <span>Grand Total</span><span>{pkr(o.total)}</span>
                  </div>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium break-words">{value}</dd>
    </div>
  );
}

const emptyProduct = {
  name: "", tagline: "", price: 2000, category: "Chaunsa", availability: "In Stock",
  discount: 0, image_key: "chaunsa", hover_key: "sindhri", is_active: true, sort_order: 99,
  description: "", image_url: "", hover_image_url: "",
};

function Products({ rows, reload }: { rows: DbProduct[]; reload: () => void }) {
  const [editing, setEditing] = useState<null | (typeof emptyProduct & { id?: string })>(null);

  const save = async () => {
    if (!editing) return;
    if (editing.name.trim().length < 2) return toast.error("Enter a product name");
    const { id: _id, created_at: _c, updated_at: _u, ...payload } = editing as typeof editing & { created_at?: string; updated_at?: string };
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
            <img src={p.image_url || imageFor(p.image_key)} alt={p.name} loading="lazy" width={600} height={400} className="h-40 w-full object-cover" />
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
                <button onClick={() => { if (confirm(`Delete ${p.name}?`)) remove(p.id); }} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-destructive">
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
              <ImageUpload label="Main photo" value={editing.image_url} fallback={imageFor(editing.image_key)} onChange={(v) => setEditing({ ...editing, image_url: v })} />
              <ImageUpload label="Second photo (hover)" value={editing.hover_image_url} fallback={imageFor(editing.hover_key)} onChange={(v) => setEditing({ ...editing, hover_image_url: v })} />
              <Select label="Default photo (if none uploaded)" value={editing.image_key} options={[...IMAGE_KEYS]} onChange={(v) => setEditing({ ...editing, image_key: v })} />
              <Select label="Default hover photo" value={editing.hover_key} options={[...IMAGE_KEYS]} onChange={(v) => setEditing({ ...editing, hover_key: v })} />
              <div className="sm:col-span-2"><TextArea label="Description" value={editing.description} rows={5} onChange={(v) => setEditing({ ...editing, description: v })} /></div>
              <Input label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) || 0 })} />
              <label className="flex items-center gap-2 self-end text-sm">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="size-4 accent-primary" />
                Show on website
              </label>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
            <button onClick={() => setEditing(null)} className="rounded-full border border-border py-3 text-sm font-semibold">Cancel</button>
            <button onClick={save} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
              Save product
            </button>
            </div>
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
        maxLength={500}
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

function Admins() {
  const list = useServerFn(listAdmins);
  const add = useServerFn(addAdmin);
  const rm = useServerFn(removeAdmin);
  const [me, setMe] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const admins = useQuery({ queryKey: ["admin-admins"], queryFn: () => list() });

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); }, []);

  const submit = async () => {
    setBusy(true);
    try {
      await add({ data: { email, password } });
      toast.success("New admin added");
      setEmail(""); setPassword("");
      admins.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add admin");
    } finally { setBusy(false); }
  };

  const doRemove = async (id: string) => {
    try {
      await rm({ data: { userId: id } });
      toast.success("Admin removed");
      setConfirmId(null);
      admins.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove admin");
    }
  };

  const target = admins.data?.find((a) => a.id === confirmId);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Add new admin</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter an email and password. They can sign in right away.</p>
        <div className="mt-4 space-y-3">
          <Input label="Email" type="email" value={email} onChange={setEmail} />
          <Input label="Password (min 8 characters)" type="password" value={password} onChange={setPassword} />
          <button disabled={busy} onClick={submit} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? "Adding…" : "Add admin"}
          </button>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Current admins</h2>
        <div className="mt-4 space-y-2">
          {admins.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {admins.data?.map((a, i) => (
            <div key={a.id} className="flex items-center justify-between gap-2 rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
              <div className="min-w-0">
                <div className="truncate font-semibold">{a.email}</div>
                <div className="text-xs text-muted-foreground">
                  {i === 0 ? "First admin" : `Admin #${i + 1}`}{a.id === me ? " · You" : ""}
                </div>
              </div>
              <button
                onClick={() => setConfirmId(a.id)}
                disabled={(admins.data?.length ?? 0) <= 1}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-destructive disabled:opacity-40"
              >
                <Trash2 className="size-3" /> Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-leaf-deep/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-background p-6 text-center shadow-2xl">
            <h3 className="font-display text-xl font-bold">Remove admin access?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{target.email}</span> will no longer be able to open the admin panel.
              {target.id === me && " This is your own account — you will lose access."}
            </p>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setConfirmId(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm">Cancel</button>
              <button onClick={() => doRemove(target.id)} className="flex-1 rounded-full bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground">Yes, remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 ?? new Error("Upload failed");
  return data.signedUrl;
}

function ImageUpload({ label, value, fallback, onChange }: { label: string; value: string; fallback?: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadImage(f)); toast.success("Image uploaded"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); }
  };
  const src = value || fallback;
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="mt-1 flex items-center gap-3 rounded-2xl border border-border p-2">
        {src ? <img src={src} alt="" className="size-14 rounded-xl object-cover" /> : <div className="size-14 rounded-xl bg-secondary" />}
        <div className="flex flex-col gap-1">
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Upload className="size-3" /> {busy ? "Uploading…" : value ? "Change" : "Upload"}
            <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          {value && <button type="button" onClick={() => onChange("")} className="text-left text-xs text-destructive">Remove</button>}
        </div>
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 self-end text-sm">
      <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-primary" : "bg-muted")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-background shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
      {label}: <b>{checked ? "On" : "Off"}</b>
    </button>
  );
}

const slugify = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

type PostForm = Omit<PostRow, "id" | "created_at" | "tags"> & { id?: string; tagsText: string };
const emptyPost = (): PostForm => ({
  title: "", slug: "", excerpt: "", content: "", category: "", tagsText: "", author: "", cover_image_url: "",
  image_alt: "", reading_minutes: 3, status: "draft", featured: false, publish_date: new Date().toISOString(),
  tagline: "", seo_title: "", seo_description: "", canonical_url: "",
});

function Blog() {
  const posts = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("publish_date", { ascending: false });
      if (error) throw error;
      return data as PostRow[];
    },
  });
  const [f, setF] = useState<PostForm | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const save = async () => {
    if (!f) return;
    if (f.title.trim().length < 2) return toast.error("Enter a title");
    const slug = slugify(f.slug || f.title);
    if (!slug) return toast.error("Enter a URL slug");
    const { id, tagsText, ...rest } = f;
    const payload = { ...rest, slug, tags: tagsText.split("\n").map((t) => t.trim()).filter(Boolean) };
    const { error } = id
      ? await supabase.from("posts").update(payload).eq("id", id)
      : await supabase.from("posts").insert(payload);
    if (error) return toast.error(error.message.includes("duplicate") ? "That URL slug is already used" : "Could not save the post");
    toast.success("Post saved");
    setF(null);
    posts.refetch();
  };

  const remove = async (p: PostRow) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", p.id);
    if (error) return toast.error("Could not delete the post");
    toast.success("Post deleted");
    posts.refetch();
  };

  const toLocal = (iso: string) => { const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

  return (
    <div className="space-y-4">
      <button onClick={() => { setF(emptyPost()); setSlugTouched(false); }} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        <Plus className="size-4" /> New post
      </button>
      <div className="space-y-3">
        {posts.data?.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-card p-4">
            <div className="flex min-w-0 items-center gap-3">
              {p.cover_image_url && <img src={p.cover_image_url} alt="" className="size-14 rounded-xl object-cover" />}
              <div className="min-w-0">
                <div className="truncate font-display font-bold">{p.title}</div>
                <div className="text-xs text-muted-foreground">/blog/{p.slug} · {new Date(p.publish_date).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {p.featured && <span className="rounded-full bg-mango px-2 py-1 text-[10px] font-bold text-leaf-deep">Featured</span>}
              <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold capitalize", p.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{p.status}</span>
              {p.status === "published" && <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-2" aria-label="View post"><ExternalLink className="size-3" /></a>}
              <button onClick={() => { setF({ ...p, tagsText: p.tags.join("\n") }); setSlugTouched(true); }} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"><Pencil className="size-3" /> Edit</button>
              <button onClick={() => remove(p)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-destructive"><Trash2 className="size-3" /> Delete</button>
            </div>
          </div>
        ))}
        {posts.data?.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
      </div>

      {f && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-leaf-deep/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-3xl rounded-3xl bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">{f.id ? "Edit post" : "New post"}</h3>
              <button onClick={() => setF(null)} aria-label="Close"><X className="size-5" /></button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v, slug: slugTouched ? f.slug : slugify(v) })} />
              <Input label="URL slug" value={f.slug} onChange={(v) => { setSlugTouched(true); setF({ ...f, slug: v }); }} />
              <div className="sm:col-span-2"><Input label="Tagline" value={f.tagline} onChange={(v) => setF({ ...f, tagline: v })} /></div>
              <div className="sm:col-span-2"><TextArea label="Excerpt" rows={2} value={f.excerpt} onChange={(v) => setF({ ...f, excerpt: v })} /></div>
              <div className="sm:col-span-2"><TextArea label="Content (Markdown)" rows={12} value={f.content} onChange={(v) => setF({ ...f, content: v })} /></div>
              <Input label="Category" value={f.category} onChange={(v) => setF({ ...f, category: v })} />
              <Input label="Author" value={f.author} onChange={(v) => setF({ ...f, author: v })} />
              <TextArea label="Tags (one per line)" rows={4} value={f.tagsText} onChange={(v) => setF({ ...f, tagsText: v })} />
              <div className="space-y-3">
                <ImageUpload label="Cover image (upload)" value={f.cover_image_url} onChange={(v) => setF({ ...f, cover_image_url: v })} />
              </div>
              <div className="sm:col-span-2"><Input label="Cover image URL" value={f.cover_image_url} onChange={(v) => setF({ ...f, cover_image_url: v })} /></div>
              <Input label="Image alt text" value={f.image_alt} onChange={(v) => setF({ ...f, image_alt: v })} />
              <Input label="Reading minutes" type="number" value={String(f.reading_minutes)} onChange={(v) => setF({ ...f, reading_minutes: Number(v) || 1 })} />
              <Select label="Status" value={f.status} options={["draft", "published"]} onChange={(v) => setF({ ...f, status: v })} />
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Publish date</label>
                <input type="datetime-local" value={toLocal(f.publish_date)} onChange={(e) => e.target.value && setF({ ...f, publish_date: new Date(e.target.value).toISOString() })}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm" />
              </div>
              <Toggle label="Featured" checked={f.featured} onChange={(v) => setF({ ...f, featured: v })} />
              <div />
              <div className="sm:col-span-2 mt-2 border-t border-border pt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO</div>
              <Input label="SEO title" value={f.seo_title} onChange={(v) => setF({ ...f, seo_title: v })} />
              <Input label="Canonical URL" value={f.canonical_url} onChange={(v) => setF({ ...f, canonical_url: v })} />
              <div className="sm:col-span-2"><TextArea label="SEO description" rows={2} value={f.seo_description} onChange={(v) => setF({ ...f, seo_description: v })} /></div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button onClick={() => setF(null)} className="rounded-full border border-border py-3 text-sm font-semibold">Cancel</button>
              <button onClick={save} className="rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Faqs() {
  const faqs = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw error;
      return data as FaqRow[];
    },
  });
  const [f, setF] = useState<(Omit<FaqRow, "id"> & { id?: string }) | null>(null);

  const save = async () => {
    if (!f) return;
    if (f.question.trim().length < 3) return toast.error("Enter a question");
    const { id, ...payload } = f as FaqRow & { created_at?: string; updated_at?: string };
    delete (payload as { created_at?: string }).created_at;
    delete (payload as { updated_at?: string }).updated_at;
    const { error } = id ? await supabase.from("faqs").update(payload).eq("id", id) : await supabase.from("faqs").insert(payload);
    if (error) return toast.error("Could not save the FAQ");
    toast.success("FAQ saved");
    setF(null);
    faqs.refetch();
  };
  const remove = async (row: FaqRow) => {
    if (!confirm("Delete this FAQ?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", row.id);
    if (error) return toast.error("Could not delete the FAQ");
    faqs.refetch();
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setF({ question: "", answer: "", sort_order: (faqs.data?.length ?? 0) + 1, is_active: true })} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        <Plus className="size-4" /> New FAQ
      </button>
      {faqs.data?.map((q) => (
        <div key={q.id} className="rounded-3xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-display font-bold">{q.question}</div>
              <p className="mt-1 text-sm text-muted-foreground">{q.answer}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", q.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{q.is_active ? "Live" : "Hidden"}</span>
              <button onClick={() => setF({ ...q })} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"><Pencil className="size-3" /> Edit</button>
              <button onClick={() => remove(q)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-destructive"><Trash2 className="size-3" /> Delete</button>
            </div>
          </div>
        </div>
      ))}
      {f && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-leaf-deep/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold">{f.id ? "Edit FAQ" : "New FAQ"}</h3>
            <div className="mt-4 space-y-3">
              <Input label="Question" value={f.question} onChange={(v) => setF({ ...f, question: v })} />
              <TextArea label="Answer" rows={5} value={f.answer} onChange={(v) => setF({ ...f, answer: v })} />
              <Input label="Order" type="number" value={String(f.sort_order)} onChange={(v) => setF({ ...f, sort_order: Number(v) || 0 })} />
              <Toggle label="Show on website" checked={f.is_active} onChange={(v) => setF({ ...f, is_active: v })} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button onClick={() => setF(null)} className="rounded-full border border-border py-3 text-sm font-semibold">Cancel</button>
              <button onClick={save} className="rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
