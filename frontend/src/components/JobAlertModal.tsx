import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface JobAlert {
  id: number;
  title: string;
  location: string;
  frequency: string;
  domains: string[];
  active: boolean;
}

interface JobAlertFormData {
  title: string;
  location: string;
  frequency: string;
  domains: string[];
}

interface JobAlertModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: JobAlertFormData) => void;
  editAlert: JobAlert | null;
  domains: string[];
  frequencies: string[];
}

const JobAlertModal: React.FC<JobAlertModalProps> = ({
  show,
  onClose,
  onSubmit,
  editAlert = null,
  domains,
  frequencies,
}) => {
  const [formData, setFormData] = useState<JobAlertFormData>({
    title: "",
    location: "",
    frequency: "Daily",
    domains: [],
  });

  useEffect(() => {
    if (editAlert) {
      setFormData({
        title: editAlert.title,
        location: editAlert.location,
        frequency: editAlert.frequency,
        domains: editAlert.domains,
      });
    } else {
      setFormData({
        title: "",
        location: "",
        frequency: "Daily",
        domains: [],
      });
    }
  }, [editAlert, show]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleDomain = (domain: string) => {
    setFormData((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500/20 rounded-lg w-full max-w-xl mx-4 animate-fadeIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-purple-100">
              {editAlert ? "Edit Job Alert" : "Create New Job Alert"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
              type="button"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Remote, New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Alert Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-purple-500"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Domains
                </label>
                <div className="flex flex-wrap gap-2">
                  {domains.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => toggleDomain(domain)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.domains.includes(domain)
                          ? "bg-purple-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                disabled={!formData.title || formData.domains.length === 0}
              >
                {editAlert ? "Save Changes" : "Create Alert"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobAlertModal;
