
import React, { useState, useEffect } from "react";
import axios from "../utilss/axios";
import {
  Calendar,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Plus,
  X,
  CalendarDays,
  Timer,
  Sparkles,
  Grid3X3,
  RefreshCw,
  Trash2,
  Users,
  Zap,
  Copy,
  Edit3,
  Play,
  StopCircle,
  CalendarPlus,
  Film
} from "lucide-react";

interface TimeSlot {
  _id?: string;
  label: string;
  range: string;
  maxBookings: number;
  isClosed: boolean;
  description?: string;
  color: string;
}

interface GlobalTemplate {
  _id?: string;
  name: string;
  description?: string;
  slots: TimeSlot[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface DateTemplate {
  _id: string;
  date: string;
  slots: TimeSlot[];
  isDateClosed: boolean;
}

const MovieHallSlotManager: React.FC = () => {
  const [showGlobalSlotModal, setShowGlobalSlotModal] = useState(false);
  const [showEditSlotModal, setShowEditSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [globalTemplate, setGlobalTemplate] = useState<GlobalTemplate | null>(null);
  const [dateTemplates, setDateTemplates] = useState<DateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [cronStatus, setCronStatus] = useState<'idle' | 'running' | 'stopped'>('idle');

  // Form states
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    label: '',
    range: '',
    maxBookings: 5,
    isClosed: false,
    description: '',
    color: '#3B82F6'
  });

  const [templateForm, setTemplateForm] = useState({
    name: 'Default Template',
    description: 'Main template for all dates'
  });

  // Color options for slots
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  useEffect(() => {
    fetchGlobalTemplate();
    fetchDateTemplates();
  }, []);

  const fetchGlobalTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/slots/global-template", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.slots && res.data.slots.length > 0) {
        setGlobalTemplate({
          _id: res.data._id,
          name: res.data.name || 'Default Template',
          description: res.data.description,
          slots: res.data.slots,
          isActive: res.data.isActive !== false
        });
      }
    } catch (err) {
      console.error("Failed to fetch global template:", err);
    }
  };

  const fetchDateTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/slot-templates", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDateTemplates(res.data || []);
    } catch (err) {
      console.error("Failed to fetch date templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGlobalTemplate = async () => {
    if (!newSlot.label || !newSlot.range) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: templateForm.name,
        description: templateForm.description,
        slots: globalTemplate ? [...globalTemplate.slots, newSlot] : [newSlot]
      };

      await axios.put("/api/slots/global-template", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewSlot({
        label: '',
        range: '',
        maxBookings: 5,
        isClosed: false,
        description: '',
        color: '#3B82F6'
      });

      setShowGlobalSlotModal(false);
      fetchGlobalTemplate();
      alert("Global template updated successfully!");
    } catch (err) {
      console.error("Failed to save global template:", err);
      alert("Failed to save global template.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setShowEditSlotModal(true);
  };

  const handleUpdateSlot = async () => {
    if (!editingSlot || !globalTemplate) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const updatedSlots = globalTemplate.slots.map(slot => 
        slot._id === editingSlot._id ? editingSlot : slot
      );

      const payload = {
        name: globalTemplate.name,
        description: globalTemplate.description,
        slots: updatedSlots
      };

      await axios.put("/api/slots/global-template", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowEditSlotModal(false);
      setEditingSlot(null);
      fetchGlobalTemplate();
      alert("Slot updated successfully!");
    } catch (err) {
      console.error("Failed to update slot:", err);
      alert("Failed to update slot.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!globalTemplate || !confirm("Are you sure you want to delete this slot?")) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const updatedSlots = globalTemplate.slots.filter(slot => slot._id !== slotId);

      const payload = {
        name: globalTemplate.name,
        description: globalTemplate.description,
        slots: updatedSlots
      };

      await axios.put("/api/slots/global-template", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchGlobalTemplate();
      alert("Slot deleted successfully!");
    } catch (err) {
      console.error("Failed to delete slot:", err);
      alert("Failed to delete slot.");
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGenerate = async () => {
    if (!globalTemplate || globalTemplate.slots.length === 0) {
      alert("Please create a global template with slots first!");
      return;
    }

    if (!confirm("This will generate slots for the next 10 days. Continue?")) {
      return;
    }

    setAutoGenerating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/slots/auto-generate-advanced", {
        days: 10
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchDateTemplates();
      alert("Auto-generated slots for next 10 days successfully!");
    } catch (err) {
      console.error("Failed to auto-generate slots:", err);
      alert(err.response?.data?.error || "Failed to auto-generate slots.");
    } finally {
      setAutoGenerating(false);
    }
  };

  const handleTriggerCron = async () => {
    setCronStatus('running');
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/slots/trigger-cron", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchDateTemplates();
      alert("Cron job triggered successfully!");
    } catch (err) {
      console.error("Failed to trigger cron job:", err);
      alert("Failed to trigger cron job.");
    } finally {
      setCronStatus('idle');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const validateTimeRange = (range: string) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(range);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2">Loading slot manager...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Film className="mr-3 h-8 w-8 text-blue-600" />
                Movie Hall Slot Manager
              </h1>
              <p className="text-gray-600 mt-2">
                Manage time slots and auto-generate dates like a movie hall
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleTriggerCron}
                disabled={cronStatus === 'running'}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  cronStatus === 'running'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {cronStatus === 'running' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {cronStatus === 'running' ? 'Running...' : 'Trigger Cron'}
              </button>
              <button
                onClick={handleAutoGenerate}
                disabled={autoGenerating || !globalTemplate || globalTemplate.slots.length === 0}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  !globalTemplate || globalTemplate.slots.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {autoGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {autoGenerating ? 'Generating...' : 'Auto-Generate 10 Days'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Global Template Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-blue-600" />
                Global Slot Template
              </h2>
              <button
                onClick={() => setShowGlobalSlotModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </button>
            </div>

            {globalTemplate && globalTemplate.slots.length > 0 ? (
              <div className="space-y-3">
                {globalTemplate.slots.map((slot, index) => (
                  <div
                    key={slot._id || index}
                    className="border rounded-lg p-4 flex items-center justify-between"
                    style={{ borderLeftColor: slot.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{slot.label}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {slot.range}
                        </span>
                        <span className="text-sm text-gray-500">
                          Max: {slot.maxBookings}
                        </span>
                      </div>
                      {slot.description && (
                        <p className="text-sm text-gray-600 mt-1">{slot.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSlot(slot)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot._id || '')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No slots defined yet</p>
                <p className="text-sm">Create your first time slot to get started</p>
              </div>
            )}
          </div>

          {/* Date Templates Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-green-600" />
                Generated Dates ({dateTemplates.length})
              </h2>
              <button
                onClick={fetchDateTemplates}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dateTemplates.length > 0 ? (
                dateTemplates.map((template) => (
                  <div key={template._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {formatDate(template.date)}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {template.slots.length} slots
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {template.slots.slice(0, 4).map((slot, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600"
                        >
                          {slot.label}: {slot.range}
                        </div>
                      ))}
                      {template.slots.length > 4 && (
                        <div className="text-xs text-gray-500 px-2 py-1">
                          +{template.slots.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No dates generated yet</p>
                  <p className="text-sm">Use auto-generate to create dates with slots</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Slot Modal */}
        {showGlobalSlotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add New Time Slot</h3>
                <button
                  onClick={() => setShowGlobalSlotModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slot Label *
                  </label>
                  <input
                    type="text"
                    value={newSlot.label}
                    onChange={(e) => setNewSlot({ ...newSlot, label: e.target.value })}
                    placeholder="e.g., Morning, Afternoon, Evening"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Range *
                  </label>
                  <input
                    type="text"
                    value={newSlot.range}
                    onChange={(e) => setNewSlot({ ...newSlot, range: e.target.value })}
                    placeholder="e.g., 09:00-10:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: HH:MM-HH:MM (24-hour)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Bookings
                  </label>
                  <input
                    type="number"
                    value={newSlot.maxBookings}
                    onChange={(e) => setNewSlot({ ...newSlot, maxBookings: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newSlot.description}
                    onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
                    placeholder="Optional description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewSlot({ ...newSlot, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newSlot.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowGlobalSlotModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGlobalTemplate}
                  disabled={saving || !newSlot.label || !newSlot.range || !validateTimeRange(newSlot.range)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    !newSlot.label || !newSlot.range || !validateTimeRange(newSlot.range)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Save Slot'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Slot Modal */}
        {showEditSlotModal && editingSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Time Slot</h3>
                <button
                  onClick={() => setShowEditSlotModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slot Label *
                  </label>
                  <input
                    type="text"
                    value={editingSlot.label}
                    onChange={(e) => setEditingSlot({ ...editingSlot, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Range *
                  </label>
                  <input
                    type="text"
                    value={editingSlot.range}
                    onChange={(e) => setEditingSlot({ ...editingSlot, range: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Bookings
                  </label>
                  <input
                    type="number"
                    value={editingSlot.maxBookings}
                    onChange={(e) => setEditingSlot({ ...editingSlot, maxBookings: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingSlot.description || ''}
                    onChange={(e) => setEditingSlot({ ...editingSlot, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingSlot({ ...editingSlot, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          editingSlot.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditSlotModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSlot}
                  disabled={saving || !editingSlot.label || !editingSlot.range}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    !editingSlot.label || !editingSlot.range
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Update Slot'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieHallSlotManager;
