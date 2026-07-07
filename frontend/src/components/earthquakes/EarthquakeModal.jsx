import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  place: Yup.string().required('Location is required'),
  magnitude: Yup.number().required('Magnitude is required').min(0, 'Min magnitude is 0').max(10, 'Max magnitude is 10'),
  depth: Yup.number().required('Depth is required').min(-5, 'Min depth is -5 km').max(800, 'Max depth is 800 km'),
  time: Yup.date().required('Time is required'),
  status: Yup.string().oneOf(['automatic', 'reviewed', 'deleted']).required('Status is required'),
  type: Yup.string().required('Type is required')
});

const EarthquakeModal = ({ isOpen, onClose, onSave, item, loading }) => {
  const formik = useFormik({
    initialValues: {
      place: '',
      magnitude: '',
      depth: '',
      time: new Date().toISOString().slice(0, 16),
      status: 'automatic',
      type: 'earthquake'
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
    enableReinitialize: true
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        // Edit mode
        const date = new Date(item.time);
        // Format for datetime-local input (YYYY-MM-DDThh:mm)
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,16);
        
        formik.setValues({
          place: item.place || '',
          magnitude: item.magnitude || '',
          depth: item.depth || '',
          time: localDateTime,
          status: item.status || 'automatic',
          type: item.type || 'earthquake'
        });
      } else {
        // Create mode
        formik.resetForm();
        formik.setFieldValue('time', new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, item]);

  if (!isOpen) return null;

  const isEdit = !!item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-full">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 sticky top-0 bg-slate-900 rounded-t-2xl z-10">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
              {isEdit ? '✏️' : '✨'}
            </span>
            {isEdit ? 'Edit Earthquake Record' : 'Log New Earthquake'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1 text-xl leading-none">
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="earthquake-form" onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="place" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location / Place</label>
              <input 
                id="place" name="place" type="text"
                placeholder="e.g. 10km SSW of Searchlight, Nevada"
                className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${formik.touched.place && formik.errors.place ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:ring-blue-500/20'} text-slate-100 text-sm focus:border-blue-500 focus:ring-2 outline-none transition-all`}
                {...formik.getFieldProps('place')}
              />
              {formik.touched.place && formik.errors.place && <span className="text-xs text-red-400">{formik.errors.place}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="magnitude" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Magnitude</label>
                <div className="relative">
                  <input 
                    id="magnitude" name="magnitude" type="number" step="0.1"
                    placeholder="e.g. 5.4"
                    className={`w-full px-4 py-2.5 pr-10 rounded-lg bg-slate-950 border ${formik.touched.magnitude && formik.errors.magnitude ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:ring-blue-500/20'} text-slate-100 text-sm focus:border-blue-500 focus:ring-2 outline-none transition-all`}
                    {...formik.getFieldProps('magnitude')}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500 text-sm font-semibold pointer-events-none">M</span>
                </div>
                {formik.touched.magnitude && formik.errors.magnitude && <span className="text-xs text-red-400">{formik.errors.magnitude}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="depth" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Depth (km)</label>
                <div className="relative">
                  <input 
                    id="depth" name="depth" type="number" step="0.1"
                    placeholder="e.g. 15.2"
                    className={`w-full px-4 py-2.5 pr-12 rounded-lg bg-slate-950 border ${formik.touched.depth && formik.errors.depth ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:ring-blue-500/20'} text-slate-100 text-sm focus:border-blue-500 focus:ring-2 outline-none transition-all`}
                    {...formik.getFieldProps('depth')}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500 text-sm font-semibold pointer-events-none">km</span>
                </div>
                {formik.touched.depth && formik.errors.depth && <span className="text-xs text-red-400">{formik.errors.depth}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="time" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time (Local)</label>
                <input 
                  id="time" name="time" type="datetime-local"
                  className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${formik.touched.time && formik.errors.time ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:ring-blue-500/20'} text-slate-100 text-sm focus:border-blue-500 focus:ring-2 outline-none transition-all [color-scheme:dark]`}
                  {...formik.getFieldProps('time')}
                />
                {formik.touched.time && formik.errors.time && <span className="text-xs text-red-400">{formik.errors.time}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                <select 
                  id="status" name="status"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
                  {...formik.getFieldProps('status')}
                >
                  <option value="automatic">Automatic</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="deleted">Deleted</option>
                </select>
                {formik.touched.status && formik.errors.status && <span className="text-xs text-red-400">{formik.errors.status}</span>}
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Type</label>
              <select 
                id="type" name="type"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
                {...formik.getFieldProps('type')}
              >
                <option value="earthquake">Earthquake</option>
                <option value="quarry blast">Quarry Blast</option>
                <option value="explosion">Explosion</option>
                <option value="ice quake">Ice Quake</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.type && formik.errors.type && <span className="text-xs text-red-400">{formik.errors.type}</span>}
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-900 rounded-b-2xl sticky bottom-0 flex justify-end gap-3 z-10">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="earthquake-form"
            disabled={loading || !formik.isValid}
            className="flex items-center justify-center min-w-[120px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <span className="spinner w-4 h-4"></span> : isEdit ? 'Save Changes' : 'Create Record'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeModal;
