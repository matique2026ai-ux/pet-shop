const fs = require('fs');
let code = fs.readFileSync('src/components/admin-settings-panel.tsx', 'utf8');

const uploadFieldStr = `
function SettingsUploadField({ label, fieldKey, initialValue, onChange, adminSecret }: FieldProps & { adminSecret: string }) {
  const [value, setValue] = useState(initialValue);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setValue(initialValue); }, [initialValue]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-secret": adminSecret },
        body: fd,
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Upload failed");
      setValue(d.url);
      onChange(fieldKey, d.url);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-col gap-2">
        {value && (
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
            <span className="text-xs text-emerald-800 truncate flex-1">{value}</span>
            <button
              type="button"
              onClick={() => { setValue(""); onChange(fieldKey, ""); }}
              className="text-xs text-red-600 hover:underline font-medium"
            >
              Remove
            </button>
          </div>
        )}
        <label className={"cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-center block w-full " + (uploading ? "bg-gray-100 text-gray-400" : "bg-emerald-600 text-white hover:bg-emerald-700")}>
          {uploading ? "Uploading..." : value ? "Replace File" : "Upload File from Device"}
          <input type="file" className="hidden" accept="image/*,video/*" disabled={uploading} onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
}
`;

code = code.replace(/function SettingsField/g, uploadFieldStr + '\nfunction SettingsField');

code = code.replace(
  /<SettingsField label="Homepage Hero Background \(Video\/Image URL\)" fieldKey="heroBackground".*?\/>/,
  '<SettingsUploadField label="Homepage Hero Background (Upload Video/Image)" fieldKey="heroBackground" adminSecret={adminSecret} initialValue={initialContent.heroBackground ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />'
);
code = code.replace(
  /<SettingsField label="Contact Page Hero Background URL" fieldKey="contactHeroImage".*?\/>/,
  '<SettingsUploadField label="Contact Page Hero Background (Upload)" fieldKey="contactHeroImage" adminSecret={adminSecret} initialValue={initialContent.contactHeroImage ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />'
);
code = code.replace(
  /<SettingsField label="Veterinary Page Hero Background URL" fieldKey="vetHeroImage".*?\/>/,
  '<SettingsUploadField label="Veterinary Page Hero Background (Upload)" fieldKey="vetHeroImage" adminSecret={adminSecret} initialValue={initialContent.vetHeroImage ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />'
);
code = code.replace(
  /<SettingsField label="About Page Hero Background URL" fieldKey="aboutHeroImage".*?\/>/,
  '<SettingsUploadField label="About Page Hero Background (Upload)" fieldKey="aboutHeroImage" adminSecret={adminSecret} initialValue={initialContent.aboutHeroImage ?? ""} onChange={(k, v) => { contentRef.current[k] = v; }} />'
);

fs.writeFileSync('src/components/admin-settings-panel.tsx', code);
