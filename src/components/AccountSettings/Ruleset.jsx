import { useState } from "react";
import { Globe, Briefcase } from "lucide-react";
import BusinessRulesetModal from "../../features/modal/BusinessRulesetModal";
const MAX_CHARS = 100;


const EditableRow = ({ label, value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setDraft(val);
    }
  };

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-400">{label}</span>

      {!editing ? (
        <div className="flex justify-between items-center">
          <span className="text-base text-white font-medium break-words">
            {value || "Not set"}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-1">
          <input
            value={draft}
            onChange={handleChange}
            maxLength={MAX_CHARS}
            className="bg-[#0F172A] border border-[#2A3555] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">
              {draft.length}/{MAX_CHARS} characters
            </span>

            <div className="flex flex-row gap-2">
                <button
              onClick={handleSave}
              disabled={draft.length === 0}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm text-white"
            >
              Save
            </button>
            <button
            onClick={() => setEditing(false)}
            //   disabled={draft.length === 0}
              className="px-4 py-2 rounded-md bg-red-700 hover:bg-red-500 disabled:opacity-50 text-sm text-white"
            >
              Cancel
            </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};


export default function RulesetEditor({
  rules,
  rulesEnabled,
  openRulesetModal,
  createRules,
  onUpdate,
}) {
  const updateField = (field, value) => {
  if (!onUpdate) return;
  onUpdate({ [field]: value });
};
 
  return (
    <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#1B2236] to-[#141A2B] p-6 shadow-xl relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-normal text-white">
          Business Ruleset
        </h2>

       
      </div>

      <div className="h-px bg-[#2A3555] mb-6" />

      {/* EMPTY STATE */}
      {!rulesEnabled ? (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0F172A] border border-[#2A3555]">
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>

          <div>
            <p className="text-white font-medium">
              No rules yet
            </p>
            {/* <p className="text-sm text-gray-400 mt-1">
              Enable rules to generate SEO-optimized defaults
            </p> */}
            <p className="text-sm text-gray-400 mt-1">
              New feature comming soon!
            </p>
          </div>
        </div>
      ) : (
        /* ACTIVE RULESET */
        <div className="flex flex-col gap-6 text-start">
          <EditableRow
            label="Title pattern"
            value={rules.product_name_rule}
            maxLength={MAX_CHARS}
            onSave={(v) => updateField("product_name_rule", v)}
          />

          <EditableRow
            label="Description pattern"
            value={rules.product_description_rule}
            maxLength={MAX_CHARS}
            onSave={(v) => updateField("product_description_rule", v)}
          />

          <EditableRow
            label="Alt text pattern"
            value={rules.product_alt_image_rule}
            maxLength={MAX_CHARS}
            onSave={(v) => updateField("product_alt_image_rule", v)}
          />

          <EditableRow
            label="Keywords"
            value={rules.keywords}
            maxLength={MAX_CHARS}
            onSave={(v) => updateField("keywords", v)}
          />
          
        </div>
        
      )}
    </div>
  );
}
