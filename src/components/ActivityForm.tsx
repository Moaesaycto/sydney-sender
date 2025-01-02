import React, { useEffect, useState } from "react";

export interface ActivityFormData {
    timeOfDay: string;
    maxTravelDistance: number;
    crowdPreference: number;
    physicalDemand: number;
    socialIntent: number;
    budget: number;
    wantsFood: boolean;
    wantsAlcohol: boolean;
    transportModes: {
        publicTransport: boolean;
        driving: boolean;
    };
}

// Reusable Components
const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="flex flex-col mt-8">{children}</label>
);

const FormSelect = ({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}) => (
    <FormLabel>
        <span>{label}</span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 p-2 border rounded focus:ring focus:ring-blue-300"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </FormLabel>
);

const FormRange = ({
    label,
    value,
    min,
    max,
    step,
    descriptions,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    descriptions: string[];
    onChange: (value: number) => void;
}) => (
    <FormLabel>
        <span>{label}</span>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="mt-2 accent-green-500"
        />
        <div className="text-center text-sm mt-1">{descriptions[value]}</div>
    </FormLabel>
);

const FormToggle = ({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) => (
    <FormLabel>
        <div className="flex items-center justify-between">
            <span className="mr-4">{label}</span>
            <div
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${checked ? "bg-green-500" : "bg-gray-300"
                    }`}
                onClick={() => onChange(!checked)}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-zinc-800 rounded-full transition-transform ${checked ? "transform translate-x-6" : ""
                        }`}
                ></div>
            </div>
        </div>
    </FormLabel>
);

const FormSubmitButton = ({ label }: { label: string }) => (
    <div className="col-span-2 flex justify-end w-full">
        <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        >
            {label}
        </button>
    </div>
);

const FormGroup = ({
    label,
    options,
    selectedOptions,
    onToggle,
}: {
    label: string;
    options: { key: string; label: string }[];
    selectedOptions: { [key: string]: boolean };
    onToggle: (key: string) => void;
}) => (
    <FormLabel>
        <span className="mb-2 font-medium">{label}</span>
        <div className="grid grid-cols-2 gap-4 mt-2">
            {options.map((option) => (
                <label key={option.key} className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={selectedOptions[option.key]}
                        onChange={() => onToggle(option.key)}
                        className="w-5 h-5 accent-green-500"
                    />
                    <span className="ml-2">{option.label}</span>
                </label>
            ))}
        </div>
    </FormLabel>
);

// Main Form
export const ActivityForm = ({
    onFormSubmit,
    setMode,
}: {
    onFormSubmit: (formData: ActivityFormData) => void;
    setMode: Function;
}) => {
    const [formData, setFormData] = useState<ActivityFormData>({
        timeOfDay: "morning",
        maxTravelDistance: 0,
        crowdPreference: 0,
        physicalDemand: 0,
        socialIntent: 0,
        budget: 0,
        wantsFood: false,
        wantsAlcohol: false,
        transportModes: {
            publicTransport: false,
            driving: false,
        },
    });

    useEffect(() => {
        setMode(formData.timeOfDay);
    }, [formData]);

    const handleInputChange = (field: keyof ActivityFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleTransportChange = (mode: "publicTransport" | "driving") => {
        setFormData((prev) => ({
            ...prev,
            transportModes: {
                ...prev.transportModes,
                [mode]: !prev.transportModes[mode],
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFormSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto md:divide-x md:divide-gray-300">
            <div className="pr-4">
                <FormSelect
                    label="When do you want the activity to be held?"
                    value={formData.timeOfDay}
                    options={[
                        { value: "morning", label: "Morning" },
                        { value: "day", label: "Day" },
                        { value: "evening", label: "Evening" },
                        { value: "night", label: "Night" },
                    ]}
                    onChange={(value) => handleInputChange("timeOfDay", value)}
                />
                <FormRange
                    label="How many people would you like to be around?"
                    value={formData.crowdPreference}
                    min={0}
                    max={4}
                    step={1}
                    descriptions={[
                        "Completely Isolated",
                        "A Few People Nearby",
                        "Moderately Busy",
                        "Busy but Comfortable",
                        "Packed and Energetic",
                    ]}
                    onChange={(value) => handleInputChange("crowdPreference", value)}
                />
                <FormRange
                    label="How social are you intending on being with your companions?"
                    value={formData.socialIntent}
                    min={0}
                    max={3}
                    step={1}
                    descriptions={[
                        "Activity focused/Minimal Talking",
                        "Light Chit-Chat",
                        "Conversation Centred",
                        "Introvert's Hell",
                    ]}
                    onChange={(value) => handleInputChange("socialIntent", value)}
                />
                <FormToggle
                    label="Are you planning on getting food?"
                    checked={formData.wantsFood}
                    onChange={(value) => handleInputChange("wantsFood", value)}
                />
                <FormGroup
                    label="Which form(s) of transport should you need to get there?"
                    options={[
                        { key: "publicTransport", label: "Public transport" },
                        { key: "driving", label: "Driving" },
                    ]}
                    selectedOptions={formData.transportModes}
                    onToggle={(key) => handleTransportChange(key as "publicTransport" | "driving")}
                />
            </div>
            <div className="pl-4">
                <FormRange
                    label="What is your preference maximum travel distance?"
                    value={formData.maxTravelDistance}
                    min={0}
                    max={4}
                    step={1}
                    descriptions={[
                        "Local Sydney (Up to 5 km)",
                        "Inner Sydney (5-15 km)",
                        "Metro Sydney (15-40 km)",
                        "Greater Sydney Region (40-100 km)",
                        "Extended Day Trips (100+ km)",
                    ]}
                    onChange={(value) => handleInputChange("maxTravelDistance", value)}
                />

                <FormRange
                    label="How physically demanding would you like the activity to be?"
                    value={formData.physicalDemand}
                    min={0}
                    max={4}
                    step={1}
                    descriptions={[
                        "Lazy",
                        "Lightly Active",
                        "Moderately Active",
                        "Challenging but Fun",
                        "Intense Exercise",
                    ]}
                    onChange={(value) => handleInputChange("physicalDemand", value)}
                />

                <FormRange
                    label="How much are you willing to spend?"
                    value={formData.budget}
                    min={0}
                    max={4}
                    step={1}
                    descriptions={[
                        "Free or Nearly Free",
                        "Budget-Friendly",
                        "Mid-Range",
                        "Splurge-Worthy",
                        '"Take My Money"',
                    ]}
                    onChange={(value) => handleInputChange("budget", value)}
                />
                <FormToggle
                    label="Do you want the option of drinking alcohol?"
                    checked={formData.wantsAlcohol}
                    onChange={(value) => handleInputChange("wantsAlcohol", value)}
                />
                <br />
                <FormSubmitButton label="Submit" />
            </div>
        </form>
    );
};