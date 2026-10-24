import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7184/api';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالات التعديل للمشروع
  const [editingProjectId, setEditingProjectId] = useState(null);

  // إدارة الوحدات للمشروع المحدد
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
    coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Projects`);
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

  const fetchUnitsForProject = async (projectId) => {
    try {
      setLoadingUnits(true);
      const response = await axios.get(`${API_BASE_URL}/Units/project/${projectId}`);
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

  // تجهيز بيانات المشروع للتعديل
  const handleEditProjectClick = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      description: project.description,
      location: project.location,
      startingPrice: project.startingPrice,
      type: project.type,
      status: project.status,
      isPublished: project.isPublished,
      coverImageUrl: project.coverImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // إلغاء التعديل
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
      coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
    });
  };

  // حفظ أو تعديل المشروع
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        startingPrice: parseFloat(projectForm.startingPrice),
        type: parseInt(projectForm.type),
        status: parseInt(projectForm.status)
      };

      if (editingProjectId) {
        // تحديث مشروع موجود (PUT)
        await axios.put(`${API_BASE_URL}/Projects/${editingProjectId}`, payload);
        alert('تم تحديث المشروع بنجاح! ✏️');
      } else {
        // إضافة مشروع جديد (POST)
        await axios.post(`${API_BASE_URL}/Projects`, payload);
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
      await axios.delete(`${API_BASE_URL}/Projects/${id}`);
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
      await axios.post(`${API_BASE_URL}/Units`, {
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

  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوحدة؟')) return;
    try {
      await axios.delete(`${API_BASE_URL}/Units/${unitId}`);
      fetchUnitsForProject(selectedProject.id);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('فشل حذف الوحدة.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex font-sans" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-l border-gray-700 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white">
              A
            </div>
            <h1 className="text-xl font-bold tracking-wide">Artech RealEstate</h1>
          </div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium">
              📁 إدارة المشاريع والوحدات
            </a>
          </nav>
        </div>
        <div className="text-xs text-gray-400 text-center">
          Admin Dashboard v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold">لوحة تحكم المشاريع والوحدات (Admin)</h2>
            <p className="text-sm text-gray-400">إدارة وعرض المشاريع، التعديل، والحذف وإدارة الوحدات</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm text-emerald-400 border border-gray-700">
            🟢 متصل بالـ API بنجاح
          </div>
        </header>

        {/* Form إضافة أو تعديل مشروع */}
        <section className={`border rounded-2xl p-6 mb-10 shadow-xl transition-all ${editingProjectId ? 'bg-amber-950/30 border-amber-600/50' : 'bg-gray-800 border-gray-700'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${editingProjectId ? 'text-amber-400' : 'text-blue-400'}`}>
              {editingProjectId ? `✏️ تعديل المشروع (ID: ${editingProjectId})` : '➕ إضافة مشروع عقاري جديد'}
            </h3>
            {editingProjectId && (
              <button
                onClick={handleCancelEdit}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition"
              >
                إالغاء التعديل ✕
              </button>
            )}
          </div>

          <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="اسم المشروع"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              required
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="الموقع (مثال: التجمع الخامس)"
              value={projectForm.location}
              onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
              required
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="السعر الابتدائي (ج.م)"
              value={projectForm.startingPrice}
              onChange={(e) => setProjectForm({ ...projectForm, startingPrice: e.target.value })}
              required
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <select
              value={projectForm.type}
              onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value={0}>سكني (Residential)</option>
              <option value={1}>تجاري (Commercial)</option>
            </select>
            <select
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value={0}>تحت الإنشاء (Under Construction)</option>
              <option value={1}>مكتمل (Completed)</option>
            </select>
            <input
              type="text"
              placeholder="رابط صورة الغلاف (URL)"
              value={projectForm.coverImageUrl}
              onChange={(e) => setProjectForm({ ...projectForm, coverImageUrl: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="وصف المشروع"
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 md:col-span-2 lg:col-span-3"
              rows="2"
            ></textarea>
            <button
              type="submit"
              className={`transition font-medium py-3 rounded-lg md:col-span-2 lg:col-span-3 shadow-lg ${
                editingProjectId ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {editingProjectId ? 'حفظ التعديلات على المشروع ✏️' : 'حفظ وإضافة المشروع 🚀'}
            </button>
          </form>
        </section>

        {/* عرض المشاريع */}
        <section>
          <h3 className="text-xl font-bold mb-6">قائمة المشاريع الحالية</h3>
          {loading && <p className="text-gray-400">جاري تحميل المشاريع...</p>}
          {error && <p className="text-red-400">{error}</p>}
          
          {!loading && !error && projects.length === 0 && (
            <p className="text-gray-400 bg-gray-800 p-6 rounded-xl text-center border border-gray-700">لا توجد مشاريع مضافة حتى الآن.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                <div>
                  <img src={project.coverImageUrl} alt={project.name} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-white">{project.name}</h4>
                      <span className="text-xs bg-blue-900 text-blue-200 px-2.5 py-1 rounded-full">
                        {project.type === 0 ? 'سكني' : 'تجاري'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <p className="text-sm text-gray-300 mb-1">📍 <strong>الموقع:</strong> {project.location}</p>
                    <p className="text-sm text-emerald-400 font-semibold mb-3">💵 يبدأ من: {project.startingPrice.toLocaleString()} ج.م</p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex flex-col gap-2 border-t border-gray-700 mt-4">
                  <button
                    onClick={() => handleOpenUnitsModal(project)}
                    className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm transition text-center"
                  >
                    إدارة الوحدات ({project.units ? project.units.length : 0}) 🏢
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProjectClick(project)}
                      className="flex-1 bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-lg text-sm transition"
                    >
                      تعديل ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-sm transition"
                    >
                      حذف 🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal إدارة وحدات المشروع */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">إدارة وحدات: {selectedProject.name}</h3>
                  <p className="text-sm text-gray-400">📍 {selectedProject.location}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white text-xl font-bold bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* فورم إضافة وحدة جديدة */}
              <form onSubmit={handleUnitSubmit} className="bg-gray-900 border border-gray-700 p-4 rounded-xl mb-6">
                <h4 className="text-sm font-semibold text-blue-400 mb-3">➕ إضافة وحدة جديدة للمشروع</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="رقم الوحدة (A-101)"
                    value={unitForm.unitNumber}
                    onChange={(e) => setUnitForm({ ...unitForm, unitNumber: e.target.value })}
                    required
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="المساحة (م²)"
                    value={unitForm.areaM2}
                    onChange={(e) => setUnitForm({ ...unitForm, areaM2: e.target.value })}
                    required
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="رقم الدور"
                    value={unitForm.floor}
                    onChange={(e) => setUnitForm({ ...unitForm, floor: e.target.value })}
                    required
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="السعر (ج.م)"
                    value={unitForm.price}
                    onChange={(e) => setUnitForm({ ...unitForm, price: e.target.value })}
                    required
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="عدد الغرف"
                    value={unitForm.bedrooms}
                    onChange={(e) => setUnitForm({ ...unitForm, bedrooms: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="عدد الحمامات"
                    value={unitForm.bathrooms}
                    onChange={(e) => setUnitForm({ ...unitForm, bathrooms: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={unitForm.availability}
                    onChange={(e) => setUnitForm({ ...unitForm, availability: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 col-span-2"
                  >
                    <option value={0}>متاحة (Available)</option>
                    <option value={1}>مباعة (Sold)</option>
                    <option value={2}>محجوزة (Reserved)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 transition font-medium py-2.5 rounded-lg text-sm"
                >
                  إضافة الوحدة للمشروع 🚀
                </button>
              </form>

              {/* قائمة الوحدات الحالية */}
              <div>
                <h4 className="text-base font-semibold mb-3">الوحدات التابعة لهذا المشروع:</h4>
                {loadingUnits ? (
                  <p className="text-gray-400 text-sm">جاري تحميل الوحدات...</p>
                ) : projectUnits.length === 0 ? (
                  <p className="text-gray-400 text-sm bg-gray-900 p-4 rounded-lg text-center border border-gray-700">لا توجد وحدات مضافة بعد لهذه الشركة/المشروع.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projectUnits.map((unit) => (
                      <div key={unit.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-base">وحدة: {unit.unitNumber}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              unit.availability === 0 ? 'bg-emerald-900 text-emerald-200' :
                              unit.availability === 1 ? 'bg-red-900 text-red-200' : 'bg-amber-900 text-amber-200'
                            }`}>
                              {unit.availability === 0 ? 'متاحة' : unit.availability === 1 ? 'مباعة' : 'محجوزة'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            📐 {unit.areaM2} م² | 🏢 الدور {unit.floor} | 🛏️ {unit.bedrooms} غرف | 🚿 {unit.bathrooms} حمام
                          </p>
                          <p className="text-sm font-semibold text-emerald-400 mt-1">💵 {unit.price.toLocaleString()} ج.م</p>
                        </div>
                        <button
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="text-red-400 hover:text-red-300 p-2 text-sm bg-red-900/20 rounded-lg transition"
                          title="حذف الوحدة"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}