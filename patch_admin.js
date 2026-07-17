const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// Replace Product Video Field
const productVideoOld = `
                <label className="block text-sm font-medium text-gray-700 mb-1">{a.products.video}</label>
                {!useVideoUrlInput ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label className={\`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors \${uploadingVideo ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}\`}>
                        {uploadingVideo ? (
                          <span className="inline-flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                            Uploading...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Upload Video File
                          </span>
                        )}
                        <input
                          type="file"
                          accept="video/*"
                          disabled={uploadingVideo}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setUseVideoUrlInput(true)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                      >
                        Or paste URL
                      </button>
                    </div>
                    {form.video && (
                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs text-gray-600 truncate flex-1">{form.video}</span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, video: "" })}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={form.video}
                      onChange={(e) => setForm({ ...form, video: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setUseVideoUrlInput(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
                    >
                      Upload instead
                    </button>
                  </div>
                )}
`;

const productVideoNew = `
                <label className="block text-sm font-medium text-gray-700 mb-1">{a.products.video}</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className={\`w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors \${uploadingVideo ? "bg-gray-100 text-gray-400" : "bg-emerald-600 text-white hover:bg-emerald-700"}\`}>
                      {uploadingVideo ? (
                        <span className="inline-flex items-center gap-2 justify-center">
                          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 justify-center">
                          <Video className="w-4 h-4" />
                          Upload Video File from Device
                        </span>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        disabled={uploadingVideo}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {form.video && (
                    <div className="flex items-center gap-3 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <Video className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span className="text-xs text-emerald-800 truncate flex-1">{form.video}</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, video: "" })}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
`;

code = code.replace(productVideoOld.trim(), productVideoNew.trim());

// Replace Category Video Field
const catVideoOld = `
              <label className="block text-sm font-medium text-gray-700 mb-1">فيديو قصير للقسم (Category Video)</label>
              <div className="flex gap-2">
                <input
                  value={catModal.videoUrl}
                  onChange={(e) => setCatModal({ ...catModal, videoUrl: e.target.value })}
                  placeholder="https://cdn.pixabay.com/..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <label className="cursor-pointer bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap text-gray-700">
                  {uploadingCatVid ? (
                    <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-4 h-4 text-gray-500" />
                  )}
                  <span>Upload</span>
                  <input type="file" accept="video/*" onChange={handleCategoryVideoUpload} className="hidden" />
                </label>
              </div>
`;

const catVideoNew = `
              <label className="block text-sm font-medium text-gray-700 mb-1">فيديو قصير للقسم (Category Video)</label>
              <div className="flex flex-col gap-2">
                {catModal.videoUrl && (
                  <div className="flex items-center gap-3 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                    <Video className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span className="text-xs text-emerald-800 truncate flex-1">{catModal.videoUrl}</span>
                    <button type="button" onClick={() => setCatModal({ ...catModal, videoUrl: "" })} className="text-xs text-red-600 hover:underline font-medium">Remove</button>
                  </div>
                )}
                <label className={"cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors " + (uploadingCatVid ? "bg-gray-100 text-gray-400" : "bg-emerald-600 text-white hover:bg-emerald-700")}>
                  {uploadingCatVid ? (
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploadingCatVid ? "Uploading..." : "Upload Video from Device"}</span>
                  <input type="file" accept="video/*" onChange={handleCategoryVideoUpload} disabled={uploadingCatVid} className="hidden" />
                </label>
              </div>
`;

code = code.replace(catVideoOld.trim(), catVideoNew.trim());

fs.writeFileSync('src/app/admin/page.tsx', code);
