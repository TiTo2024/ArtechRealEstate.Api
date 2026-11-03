// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ProjectGalleryManager from './ProjectGalleryManager';


// const API_BASE_URL = 'https://localhost:7184/api';

// export default function App() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // حالة رفع الصور
//   const [uploading, setUploading] = useState(false);

//   // حالات التعديل للمشروع
//   const [editingProjectId, setEditingProjectId] = useState(null);

//   // إدارة الوحدات والمعرض للمشروع المحدد
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [projectUnits, setProjectUnits] = useState([]);
//   const [loadingUnits, setLoadingUnits] = useState(false);

//   // فورم المشروع
//   const [projectForm, setProjectForm] = useState({
//     name: '',
//     description: '',
//     location: '',
//     startingPrice: '',
//     type: 0,
//     status: 0,
//     isPublished: true,
//     coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
//   });

//   // فورم الوحدة
//   const [unitForm, setUnitForm] = useState({
//     unitNumber: '',
//     areaM2: '',
//     floor: 1,
//     bedrooms: 2,
//     bathrooms: 1,
//     price: '',
//     availability: 0
//   });

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/Projects`);
//       setProjects(response.data);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError('فشل في الاتصال بالـ Backend. تأكد أنه يعمل!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // دالة رفع ملف الصورة للسيرفر
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       setUploading(true);
//       const response = await axios.post(`${API_BASE_URL}/Uploads`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setProjectForm(prev => ({
//         ...prev,
//         coverImageUrl: response.data.url
//       }));
//       alert('تم رفع الصورة بنجاح! 📸');
//     } catch (err) {
//       console.error(err);
//       alert('حدث خطأ أثناء رفع الصورة.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const fetchUnitsForProject = async (projectId) => {
//     try {
//       setLoadingUnits(true);
//       const response = await axios.get(`${API_BASE_URL}/Units/project/${projectId}`);
//       setProjectUnits(response.data);
//     } catch (err) {
//       console.error(err);
//       alert('حدث خطأ أثناء جلب الوحدات.');
//     } finally {
//       setLoadingUnits(false);
//     }
//   };

//   const handleOpenUnitsModal = (project) => {
//     setSelectedProject(project);
//     fetchUnitsForProject(project.id);
//   };

//   const handleEditProjectClick = (project) => {
//     setEditingProjectId(project.id);
//     setProjectForm({
//       name: project.name,
//       description: project.description,
//       location: project.location,
//       startingPrice: project.startingPrice,
//       type: project.type,
//       status: project.status,
//       isPublished: project.isPublished,
//       coverImageUrl: project.coverImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleCancelEdit = () => {
//     setEditingProjectId(null);
//     setProjectForm({
//       name: '',
//       description: '',
//       location: '',
//       startingPrice: '',
//       type: 0,
//       status: 0,
//       isPublished: true,
//       coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
//     });
//   };

//   const handleProjectSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...projectForm,
//         startingPrice: parseFloat(projectForm.startingPrice),
//         type: parseInt(projectForm.type),
//         status: parseInt(projectForm.status)
//       };

//       if (editingProjectId) {
//         await axios.put(`${API_BASE_URL}/Projects/${editingProjectId}`, payload);
//         alert('تم تحديث المشروع بنجاح! ✏️');
//       } else {
//         await axios.post(`${API_BASE_URL}/Projects`, payload);
//         alert('تم إضافة المشروع بنجاح! 🎉');
//       }

//       fetchProjects();
//       handleCancelEdit();
//     } catch (err) {
//       console.error(err);
//       alert('حدث خطأ أثناء حفظ المشروع.');
//     }
//   };

//   const handleDeleteProject = async (id) => {
//     if (!window.confirm('هل أنت متأكد من حذف هذا المشروع بالكامل؟')) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/Projects/${id}`);
//       fetchProjects();
//     } catch (err) {
//       console.error(err);
//       alert('فشل حذف المشروع.');
//     }
//   };

//   const handleUnitSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedProject) return;

//     try {
//       await axios.post(`${API_BASE_URL}/Units`, {
//         ...unitForm,
//         areaM2: parseFloat(unitForm.areaM2),
//         floor: parseInt(unitForm.floor),
//         bedrooms: parseInt(unitForm.bedrooms),
//         bathrooms: parseInt(unitForm.bathrooms),
//         price: parseFloat(unitForm.price),
//         availability: parseInt(unitForm.availability),
//         projectId: selectedProject.id
//       });

//       fetchUnitsForProject(selectedProject.id);
//       fetchProjects();
//       setUnitForm({
//         unitNumber: '',
//         areaM2: '',
//         floor: 1,
//         bedrooms: 2,
//         bathrooms: 1,
//         price: '',
//         availability: 0
//       });
//       alert('تم إضافة الوحدة بنجاح! 🏢');
//     } catch (err) {
//       console.error(err);
//       alert('حدث خطأ أثناء إضافة الوحدة.');
//     }
//   };

//   const handleDeleteUnit = async (unitId) => {
//     if (!window.confirm('هل أنت متأكد من حذف هذه الوحدة؟')) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/Units/${unitId}`);
//       fetchUnitsForProject(selectedProject.id);
//       fetchProjects();
//     } catch (err) {
//       console.error(err);
//       alert('فشل حذف الوحدة.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 flex font-sans" dir="rtl">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 border-l border-gray-700 p-6 flex flex-col justify-between hidden md:flex">
//         <div>
//           <div className="flex items-center gap-3 mb-8">
//             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white">
//               A
//             </div>
//             <h1 className="text-xl font-bold tracking-wide">Artech RealEstate</h1>
//           </div>
//           <nav className="space-y-2">
//             <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium">
//               📁 إدارة المشاريع والوحدات
//             </a>
//           </nav>
//         </div>
//         <div className="text-xs text-gray-400 text-center">
//           Admin Dashboard v1.0
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
//           <div>
//             <h2 className="text-2xl font-bold">لوحة تحكم المشاريع والوسائط (Phase 4)</h2>
//             <p className="text-sm text-gray-400">إدارة وعرض المشاريع، رفع الصور الحقيقية وتحديث البيانات</p>
//           </div>
//           <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm text-emerald-400 border border-gray-700">
//             🟢 متصل بالـ API بنجاح
//           </div>
//         </header>

//         {/* Form إضافة أو تعديل مشروع مع خيار رفع الصور */}
//         <section className={`border rounded-2xl p-6 mb-10 shadow-xl transition-all ${editingProjectId ? 'bg-amber-950/30 border-amber-600/50' : 'bg-gray-800 border-gray-700'}`}>
//           <div className="flex justify-between items-center mb-4">
//             <h3 className={`text-lg font-semibold ${editingProjectId ? 'text-amber-400' : 'text-blue-400'}`}>
//               {editingProjectId ? `✏️ تعديل المشروع (ID: ${editingProjectId})` : '➕ إضافة مشروع عقاري جديد'}
//             </h3>
//             {editingProjectId && (
//               <button
//                 onClick={handleCancelEdit}
//                 className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition"
//               >
//                 إلغاء التعديل ✕
//               </button>
//             )}
//           </div>

//           <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <input
//               type="text"
//               placeholder="اسم المشروع"
//               value={projectForm.name}
//               onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
//               required
//               className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="الموقع (مثال: التجمع الخامس)"
//               value={projectForm.location}
//               onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
//               required
//               className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
//             />
//             <input
//               type="number"
//               placeholder="السعر الابتدائي (ج.م)"
//               value={projectForm.startingPrice}
//               onChange={(e) => setProjectForm({ ...projectForm, startingPrice: e.target.value })}
//               required
//               className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
//             />
//             <select
//               value={projectForm.type}
//               onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
//               className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
//             >
//               <option value={0}>سكني (Residential)</option>
//               <option value={1}>تجاري (Commercial)</option>
//             </select>
//             <select
//               value={projectForm.status}
//               onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
//               className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
//             >
//               <option value={0}>تحت الإنشاء (Under Construction)</option>
//               <option value={1}>مكتمل (Completed)</option>
//             </select>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs text-gray-400">رفع صورة من الجهاز 📤</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//                 disabled={uploading}
//                 className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-blue-600 file:text-white"
//               />
//               {uploading && <span className="text-xs text-amber-400">جاري جلب ورفع الصورة...</span>}
//             </div>

//             <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
//               <label className="text-xs text-gray-400">رابط صورة الغلاف</label>
//               <input
//                 type="text"
//                 placeholder="رابط صورة الغلاف (URL)"
//                 value={projectForm.coverImageUrl}
//                 onChange={(e) => setProjectForm({ ...projectForm, coverImageUrl: e.target.value })}
//                 className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
//               />
//             </div>

//             <textarea
//               placeholder="وصف المشروع"
//               value={projectForm.description}
//               onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
//               className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 md:col-span-2 lg:col-span-3"
//               rows="2"
//             ></textarea>

//             <button
//               type="submit"
//               className={`transition font-medium py-3 rounded-lg md:col-span-2 lg:col-span-3 shadow-lg ${
//                 editingProjectId ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//             >
//               {editingProjectId ? 'حفظ التعديلات على المشروع ✏️' : 'حفظ وإضافة المشروع 🚀'}
//             </button>
//           </form>
//         </section>

//         {/* عرض المشاريع مع الصور المرفوعة */}
//         <section>
//           <h3 className="text-xl font-bold mb-6">قائمة المشاريع الحالية</h3>
//           {loading && <p className="text-gray-400">جاري تحميل المشاريع...</p>}
//           {error && <p className="text-red-400">{error}</p>}

//           {!loading && !error && projects.length === 0 && (
//             <p className="text-gray-400 bg-gray-800 p-6 rounded-xl text-center border border-gray-700">لا توجد مشاريع مضافة حتى الآن.</p>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map((project) => (
//               <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
//                 <div>
//                   <img src={project.coverImageUrl} alt={project.name} className="w-full h-48 object-cover" />
//                   <div className="p-5">
//                     <div className="flex justify-between items-start mb-2">
//                       <h4 className="font-bold text-lg text-white">{project.name}</h4>
//                       <span className="text-xs bg-blue-900 text-blue-200 px-2.5 py-1 rounded-full">
//                         {project.type === 0 ? 'سكني' : 'تجاري'}
//                       </span>
//                     </div>
//                     <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
//                     <p className="text-sm text-gray-300 mb-1">📍 <strong>الموقع:</strong> {project.location}</p>
//                     <p className="text-sm text-emerald-400 font-semibold mb-3">💵 يبدأ من: {project.startingPrice.toLocaleString()} ج.م</p>
//                   </div>
//                 </div>
//                 <div className="p-5 pt-0 flex flex-col gap-2 border-t border-gray-700 mt-4">
//                   <button
//                     onClick={() => handleOpenUnitsModal(project)}
//                     className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm transition text-center"
//                   >
//                     إدارة الوحدات والمعرض ({project.units ? project.units.length : 0}) 🏢📸
//                   </button>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEditProjectClick(project)}
//                       className="flex-1 bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-lg text-sm transition"
//                     >
//                       تعديل ✏️
//                     </button>
//                     <button
//                       onClick={() => handleDeleteProject(project.id)}
//                       className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-sm transition"
//                     >
//                       حذف 🗑️
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Modal إدارة وحدات المشروع ومعرض الصور */}
//         {selectedProject && (
//           <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
//             <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
//               <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
//                 <div>
//                   <h3 className="text-xl font-bold text-white">إدارة مشروع: {selectedProject.name}</h3>
//                   <p className="text-sm text-gray-400">📍 {selectedProject.location}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedProject(null)}
//                   className="text-gray-400 hover:text-white text-xl font-bold bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* معرض صور المشروع (Gallery Manager) */}
//               <div className="mb-8">
//                 <ProjectGalleryManager projectId={selectedProject.id} />
//               </div>

//               {/* فورم إضافة وحدة جديدة */}
//               <form onSubmit={handleUnitSubmit} className="bg-gray-900 border border-gray-700 p-4 rounded-xl mb-6">
//                 <h4 className="text-sm font-semibold text-blue-400 mb-3">➕ إضافة وحدة جديدة للمشروع</h4>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
//                   <input
//                     type="text"
//                     placeholder="رقم الوحدة (A-101)"
//                     value={unitForm.unitNumber}
//                     onChange={(e) => setUnitForm({ ...unitForm, unitNumber: e.target.value })}
//                     required
//                     className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
//                   />
//                   <input
//                     type="number"
//                     placeholder="المساحة (م²)"
//                     value={unitForm.areaM2}
//                     onChange={(e) => setUnitForm({ ...unitForm, areaM2: e.target.value })}
//                     required
//                     className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
//                   />
//                   <input
//                     type="number"
//                     placeholder="رقم الدور"
//                     value={unitForm.floor}
//                     onChange={(e) => setUnitForm({ ...unitForm, floor: e.target.value })}
//                     required
//                     className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
//                   />
//                   <input
//                     type="number"
//                     placeholder="السعر (ج.م)"
//                     value={unitForm.price}
//                     onChange={(e) => setUnitForm({ ...unitForm, price: e.target.value })}
//                     required
//                     className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
//                   />
//                   <input
//                     type="number"
//                     placeholder="عدد الغرف"
//                     value={unitForm.bedrooms}
//                     onChange={(e) => setUnitForm({ ...unitForm, bedrooms: e.target.value })}
//                     className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
//                   />
//                   <input
//                     type="number"
//                     placeholder="عدد الحمامات"
//                     value={unitForm.bathrooms}
//                     onChange={(e) => setUnitForm({ ...unitForm, bathrooms: e.target.value })}
//                     className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
//                   />
//                   <select
//                     value={unitForm.availability}
//                     onChange={(e) => setUnitForm({ ...unitForm, availability: e.target.value })}
//                     className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 col-span-2"
//                   >
//                     <option value={0}>متاحة (Available)</option>
//                     <option value={1}>مباعة (Sold)</option>
//                     <option value={2}>محجوزة (Reserved)</option>
//                   </select>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-emerald-600 hover:bg-emerald-700 transition font-medium py-2.5 rounded-lg text-sm"
//                 >
//                   إضافة الوحدة للمشروع 🚀
//                 </button>
//               </form>

//               {/* قائمة الوحدات الحالية */}
//               <div>
//                 <h4 className="text-base font-semibold mb-3">الوحدات التابعة لهذا المشروع:</h4>
//                 {loadingUnits ? (
//                   <p className="text-gray-400 text-sm">جاري تحميل الوحدات...</p>
//                 ) : projectUnits.length === 0 ? (
//                   <p className="text-gray-400 text-sm bg-gray-900 p-4 rounded-lg text-center border border-gray-700">لا توجد وحدات مضافة بعد لهذا المشروع.</p>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {projectUnits.map((unit) => (
//                       <div key={unit.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex justify-between items-center">
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="font-bold text-white text-base">وحدة: {unit.unitNumber}</span>
//                             <span className={`text-xs px-2 py-0.5 rounded ${
//                               unit.availability === 0 ? 'bg-emerald-900 text-emerald-200' :
//                               unit.availability === 1 ? 'bg-red-900 text-red-200' : 'bg-amber-900 text-amber-200'
//                             }`}>
//                               {unit.availability === 0 ? 'متاحة' : unit.availability === 1 ? 'مباعة' : 'محجوزة'}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-400">
//                             📐 {unit.areaM2} م² | 🏢 الدور {unit.floor} | 🛏️ {unit.bedrooms} غرف | 🚿 {unit.bathrooms} حمام
//                           </p>
//                           <p className="text-sm font-semibold text-emerald-400 mt-1">💵 {unit.price.toLocaleString()} ج.م</p>
//                         </div>
//                         <button
//                           onClick={() => handleDeleteUnit(unit.id)}
//                           className="text-red-400 hover:text-red-300 p-2 text-sm bg-red-900/20 rounded-lg transition"
//                           title="حذف الوحدة"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//             </div>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from './Api/axiosInstance';
import ProjectGalleryManager from './ProjectGalleryManager';

const API_BASE_URL = 'http://localhost:5275/api';

export default function AdminPage({ user, onSignOut }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const showNotice = (message, type = 'success') => {
    setNotice({ message, type });
  };

  // حالة رفع الصور
  const [uploading, setUploading] = useState(false);

  // حالات التعديل للمشروع
  const [editingProjectId, setEditingProjectId] = useState(null);

  // إدارة الوحدات والمعرض للمشروع المحدد
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectUnits, setProjectUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  // فورم المشروع
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    location: '',
    startingPrice: '',
    type: 0,
    status: 0,
    isPublished: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    units: [],
    galleryImages: []
  });

  // فورم الوحدة
  const [unitForm, setUnitForm] = useState({
    unitNumber: '',
    areaM2: '',
    floor: 1,
    bedrooms: 2,
    bathrooms: 1,
    price: '',
    availability: 0
  });

  const [draftUnit, setDraftUnit] = useState({
    unitNumber: '',
    areaM2: '',
    floor: 1,
    bedrooms: 2,
    bathrooms: 1,
    price: 0,
    availability: 0
  });
  const [draftGalleryUrl, setDraftGalleryUrl] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Projects');
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('فشل في الاتصال بالـ Backend. تأكد أنه يعمل!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.admin-main .scroll-reveal:not(.is-visible)');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [projects]);

  // دالة رفع ملف الصورة للسيرفر
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/Uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProjectForm(prev => ({
        ...prev,
        coverImageUrl: response.data.url
      }));
      alert('تم رفع الصورة بنجاح! 📸');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الصورة.');
    } finally {
      setUploading(false);
    }
  };

  const fetchUnitsForProject = async (projectId) => {
    try {
      setLoadingUnits(true);
      const response = await api.get(`/Units/project/${projectId}`);
      setProjectUnits(response.data);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء جلب الوحدات.');
    } finally {
      setLoadingUnits(false);
    }
  };

  const handleOpenUnitsModal = (project) => {
    setSelectedProject(project);
    fetchUnitsForProject(project.id);
  };

  const handleEditProjectClick = (project) => {
    const [primaryUnit, ...additionalUnits] = project.units || [];
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      description: project.description,
      location: project.location,
      startingPrice: project.startingPrice,
      type: project.type,
      status: project.status,
      isPublished: project.isPublished,
      coverImageUrl: project.coverImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      units: additionalUnits,
      galleryImages: (project.galleryImages || []).map((image) => image.imageUrl)
    });
    setDraftUnit(primaryUnit ? {
      unitNumber: primaryUnit.unitNumber,
      areaM2: primaryUnit.areaM2,
      floor: primaryUnit.floor,
      bedrooms: primaryUnit.bedrooms,
      bathrooms: primaryUnit.bathrooms,
      price: 0,
      availability: 0
    } : { unitNumber: '', areaM2: '', floor: 1, bedrooms: 2, bathrooms: 1, price: 0, availability: 0 });
    setDraftGalleryUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setProjectForm({
      name: '',
      description: '',
      location: '',
      startingPrice: '',
      type: 0,
      status: 0,
      isPublished: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      units: [],
      galleryImages: []
    });
    setDraftUnit({ unitNumber: '', areaM2: '', floor: 1, bedrooms: 2, bathrooms: 1, price: 0, availability: 0 });
    setDraftGalleryUrl('');
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        startingPrice: parseFloat(projectForm.startingPrice),
        type: parseInt(projectForm.type),
        status: parseInt(projectForm.status),
        units: !draftUnit.unitNumber
          ? projectForm.units
          : [{
              ...draftUnit,
              areaM2: parseFloat(draftUnit.areaM2),
              floor: parseInt(draftUnit.floor),
              bedrooms: parseInt(draftUnit.bedrooms),
              bathrooms: parseInt(draftUnit.bathrooms),
              price: 0,
              availability: 0
            }],
        galleryImages: projectForm.galleryImages.map((imageUrl) => ({ imageUrl }))
      };

      if (editingProjectId) {
        await api.put(`/Projects/${editingProjectId}`, payload);
        alert('تم تحديث المشروع بنجاح! ✏️');
      } else {
        await api.post('/Projects', payload);
        alert('تم إضافة المشروع بنجاح! 🎉');
      }

      fetchProjects();
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المشروع.');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع بالكامل؟')) return;
    try {
      await api.delete(`/Projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('فشل حذف المشروع.');
    }
  };

  const handleUnitSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      await api.post('/Units', {
        ...unitForm,
        areaM2: parseFloat(unitForm.areaM2),
        floor: parseInt(unitForm.floor),
        bedrooms: parseInt(unitForm.bedrooms),
        bathrooms: parseInt(unitForm.bathrooms),
        price: parseFloat(unitForm.price),
        availability: parseInt(unitForm.availability),
        projectId: selectedProject.id
      });

      fetchUnitsForProject(selectedProject.id);
      fetchProjects();
      setUnitForm({
        unitNumber: '',
        areaM2: '',
        floor: 1,
        bedrooms: 2,
        bathrooms: 1,
        price: '',
        availability: 0
      });
      alert('تم إضافة الوحدة بنجاح! 🏢');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة الوحدة.');
    }
  };

  const addDraftGalleryImage = () => {
    const imageUrl = draftGalleryUrl.trim();
    if (!imageUrl) return;
    setProjectForm((current) => ({
      ...current,
      galleryImages: [...current.galleryImages, imageUrl]
    }));
    setDraftGalleryUrl('');
  };

  const removeDraftGalleryImage = (index) => {
    setProjectForm((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوحدة؟')) return;
    try {
      await api.delete(`/Units/${unitId}`);
      fetchUnitsForProject(selectedProject.id);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('فشل حذف الوحدة.');
    }
  };

  const signOut = async () => {
    try {
      await api.post('/Auth/logout');
    } finally {
      onSignOut();
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <span>A</span>
          <strong>Artech Real Estate</strong>
        </a>
        <nav className="admin-nav" aria-label="Admin navigation">
          <a href="#projects">Projects</a>
          <a href="#project-editor">Project editor</a>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button className="admin-sign-out" type="button" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Project management</h1>
            <p>Manage the properties shown across the public website.</p>
          </div>
          <span className="admin-status">API connected</span>
        </header>

        <section className="admin-panel scroll-reveal" id="project-editor">
          <div className="admin-panel-heading">
            <h2>{editingProjectId ? 'Edit project' : 'New project'}</h2>
            {editingProjectId && <span className="admin-editing-badge">Editing #{editingProjectId}</span>}
          </div>

          <form className="admin-project-form" onSubmit={handleProjectSubmit}>
            <label className="admin-field">
              Project name
              <input value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} required />
            </label>
            <label className="admin-field">
              Location
              <input value={projectForm.location} onChange={(event) => setProjectForm({ ...projectForm, location: event.target.value })} required />
            </label>
            <label className="admin-field">
              Starting price (EGP)
              <input type="number" value={projectForm.startingPrice} onChange={(event) => setProjectForm({ ...projectForm, startingPrice: event.target.value })} required />
            </label>
            <label className="admin-field">
              Property type
              <select value={projectForm.type} onChange={(event) => setProjectForm({ ...projectForm, type: event.target.value })}>
                <option value={0}>Residential</option>
                <option value={1}>Commercial</option>
              </select>
            </label>
            <label className="admin-field">
              Status
              <select value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })}>
                <option value={0}>Under construction</option>
                <option value={1}>Completed</option>
              </select>
            </label>
            <label className="admin-field">
              Cover image
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
            </label>
            <label className="admin-field admin-field-wide">
              Cover image URL
              <input value={projectForm.coverImageUrl} onChange={(event) => setProjectForm({ ...projectForm, coverImageUrl: event.target.value })} />
            </label>
            <label className="admin-field admin-field-wide">
              Description
              <textarea value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} />
            </label>
            <label className="admin-publish-field">
              <input type="checkbox" checked={projectForm.isPublished} onChange={(event) => setProjectForm({ ...projectForm, isPublished: event.target.checked })} />
              Publish this project on the public website
            </label>

            <>
                <section className="project-create-section admin-field-wide">
                  <div className="project-create-heading">
                    <div>
                      <h3>Units</h3>
                      <p>Add the units included with this project.</p>
                    </div>
                    <span>{projectForm.units.length} added</span>
                  </div>
                  <div className="draft-unit-grid">
                    <label><span>Unit</span><input aria-label="Unit number" value={draftUnit.unitNumber} onChange={(event) => setDraftUnit({ ...draftUnit, unitNumber: event.target.value })} /></label>
                    <label><span>Area (m²)</span><input aria-label="Area" type="number" value={draftUnit.areaM2} onChange={(event) => setDraftUnit({ ...draftUnit, areaM2: event.target.value })} /></label>
                    <label><span>Floor</span><input aria-label="Floor" type="number" value={draftUnit.floor} onChange={(event) => setDraftUnit({ ...draftUnit, floor: event.target.value })} /></label>
                    <label><span>Bedrooms</span><input aria-label="Bedrooms" type="number" value={draftUnit.bedrooms} onChange={(event) => setDraftUnit({ ...draftUnit, bedrooms: event.target.value })} /></label>
                    <label><span>Bathrooms</span><input aria-label="Bathrooms" type="number" value={draftUnit.bathrooms} onChange={(event) => setDraftUnit({ ...draftUnit, bathrooms: event.target.value })} /></label>
                  </div>
                </section>

                <section className="project-create-section admin-field-wide">
                  <div className="project-create-heading">
                    <div>
                      <h3>Gallery</h3>
                      <p>Add project images before publishing.</p>
                    </div>
                    <span>{projectForm.galleryImages.length} added</span>
                  </div>
                  <div className="draft-gallery-form">
                    <input type="url" placeholder="Enter an image URL" value={draftGalleryUrl} onChange={(event) => setDraftGalleryUrl(event.target.value)} />
                    <button className="admin-secondary-button" type="button" onClick={addDraftGalleryImage}>Add image</button>
                  </div>
                  {projectForm.galleryImages.length > 0 && (
                    <div className="draft-gallery-list">
                      {projectForm.galleryImages.map((imageUrl, index) => (
                        <div className="draft-gallery-row" key={`${imageUrl}-${index}`}>
                          <img src={imageUrl} alt={`Project gallery ${index + 1}`} />
                          <span>{imageUrl}</span>
                          <button type="button" onClick={() => removeDraftGalleryImage(index)} aria-label={`Remove gallery image ${index + 1}`}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
            </>

            <div className="admin-submit-row">
              {editingProjectId && <button className="admin-secondary-button" type="button" onClick={handleCancelEdit}>Cancel</button>}
              <button className="admin-primary-button" type="submit">{editingProjectId ? 'Save changes' : 'Add project'} →</button>
            </div>
          </form>
        </section>

        <section className="admin-projects-section scroll-reveal" id="projects">
          <div className="admin-panel-heading">
            <h2>Portfolio</h2>
            <span className="admin-editing-badge">{projects.length} project{projects.length === 1 ? '' : 's'}</span>
          </div>
          {loading ? <p className="admin-loading">Loading projects…</p> : error ? <p className="admin-empty">{error}</p> : projects.length === 0 ? (
            <p className="admin-empty">No projects have been added yet.</p>
          ) : (
            <div className="admin-project-grid">
              {projects.map((project) => (
                <article className="admin-project-card scroll-reveal" key={project.id}>
                  <img src={project.coverImageUrl} alt={project.name} />
                  <div className="admin-project-card-body">
                    <h3>{project.name}</h3>
                    <p>{project.location} · {project.type === 0 ? 'Residential' : 'Commercial'}</p>
                    <p>{project.status === 1 ? 'Completed' : 'Under construction'} · {project.isPublished ? 'Published' : 'Draft'}</p>
                    <p>From EGP {project.startingPrice.toLocaleString()}</p>
                  </div>
                  <div className="admin-project-actions">
                    <button className="admin-secondary-button" type="button" onClick={() => handleEditProjectClick(project)}>Edit</button>
                    <button className="admin-danger-button" type="button" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {selectedProject && (
          <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-project-modal-title">
            <button className="admin-modal-backdrop" type="button" onClick={() => setSelectedProject(null)} aria-label="Close project manager" />
            <section className="admin-modal-panel">
              <div className="admin-modal-heading">
                <div>
                  <h2 id="admin-project-modal-title">{selectedProject.name}</h2>
                  <p>{selectedProject.location}</p>
                </div>
                <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close">×</button>
              </div>
              <ProjectGalleryManager projectId={selectedProject.id} />
              <form className="admin-unit-form" onSubmit={handleUnitSubmit}>
                <h3>Add unit</h3>
                <div className="admin-unit-grid">
                  <input placeholder="Unit number" value={unitForm.unitNumber} onChange={(event) => setUnitForm({ ...unitForm, unitNumber: event.target.value })} required />
                  <input type="number" placeholder="Area m²" value={unitForm.areaM2} onChange={(event) => setUnitForm({ ...unitForm, areaM2: event.target.value })} required />
                  <input type="number" placeholder="Floor" value={unitForm.floor} onChange={(event) => setUnitForm({ ...unitForm, floor: event.target.value })} required />
                  <input type="number" placeholder="Price EGP" value={unitForm.price} onChange={(event) => setUnitForm({ ...unitForm, price: event.target.value })} required />
                  <input type="number" placeholder="Bedrooms" value={unitForm.bedrooms} onChange={(event) => setUnitForm({ ...unitForm, bedrooms: event.target.value })} />
                  <input type="number" placeholder="Bathrooms" value={unitForm.bathrooms} onChange={(event) => setUnitForm({ ...unitForm, bathrooms: event.target.value })} />
                  <select value={unitForm.availability} onChange={(event) => setUnitForm({ ...unitForm, availability: event.target.value })}>
                    <option value={0}>Available</option>
                    <option value={1}>Sold</option>
                    <option value={2}>Reserved</option>
                  </select>
                </div>
                <button className="admin-primary-button" type="submit">Add unit</button>
              </form>
              <div className="admin-unit-list">
                <h3>Units</h3>
                {loadingUnits ? <p>Loading units…</p> : projectUnits.length === 0 ? <p>No units added yet.</p> : projectUnits.map((unit) => (
                  <div className="admin-unit-row" key={unit.id}>
                    <span><strong>Unit {unit.unitNumber}</strong><small>{unit.areaM2} m² · Floor {unit.floor}</small></span>
                    <strong>EGP {unit.price.toLocaleString()}</strong>
                    <button type="button" onClick={() => handleDeleteUnit(unit.id)} aria-label={`Delete unit ${unit.id}`}>Delete</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}