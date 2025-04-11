import { useEffect, useRef, useState } from "react";
import { Cityscape } from "../../global/components/decorations/Cityscape";
import { TimeMode } from "../../global/components/decorations/Cityscape";
import { ActivityForm, ActivityFormData } from "../ActivityForm";
import { GeneratedResults, generateResults } from "./Algorithm";
import "./SydneySender.css";

export const SydneySender = () => {
    const [timeMode, setTimeMode] = useState<TimeMode>("morning");
    const [transitionMode, setTransitionMode] = useState<TimeMode>("morning");
    const [generatedResults, setGeneratedResults] = useState<GeneratedResults[]>([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [prevVisibleCount, setPrevVisibleCount] = useState(0);
    const [containerHeight, setContainerHeight] = useState("auto");
    const resultsRef = useRef<HTMLDivElement>(null);

    void setTimeMode;

    const handleFormSubmit = (formData: ActivityFormData) => {
        setGeneratedResults([]);
        const newResults = generateResults(formData).sort((a, b) => b.score - a.score);
        setGeneratedResults(newResults);
        setVisibleCount(10);
        setPrevVisibleCount(0);

        // Reset container height
        setContainerHeight("auto");

        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
    };

    const handleLoadMore = () => {
        setPrevVisibleCount(visibleCount);
        setVisibleCount((prev) => Math.min(prev + 10, generatedResults.length));
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTransitionMode(timeMode);
        }, 300);

        return () => clearTimeout(timeout);
    }, [timeMode]);

    // Dynamically calculate the container height
    useEffect(() => {
        if (resultsRef.current) {
            const scrollHeight = resultsRef.current.scrollHeight;
            setContainerHeight(`${scrollHeight}px`);
        }
    }, [generatedResults, visibleCount]);

    return (
        <div
            className="relative flex flex-col items-center justify-center py-10"
            style={{
                position: "relative",
                color: "white",
                overflow: "hidden",
            }}
        >
            {/* Cityscape Background */}
            <div
                className="absolute inset-0"
                style={{
                    zIndex: 1,
                }}
            >
                <Cityscape height={200} seed="dkthegreat" mode={transitionMode} />
            </div>

            {/* Instructions Section */}
            <div
                className="relative w-[90%] max-w-4xl p-6 mb-6 rounded-lg shadow-lg"
                style={{
                    zIndex: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                }}
            >
                <h2 className="text-2xl font-bold mb-4">How to Use</h2>
                <p className="text-left">
                    Enter what you feel like doing in the activity form below. The system will
                    generate a list of activities tailored to your input, ranked by their relevance. Each activity
                    is displayed along with a relevance score (in percentage) to show how closely it matches your
                    preferences.
                </p>
                <br />
                <p className="text-left">
                    Please note that certain activities may be offered with some naivity. For example, wanting the option
                    of alcohol and also driving will need to be accounted for by you.
                </p>
                <br />
                <hr />
                <p className="mt-4">
                    Use the "Load More" button to reveal additional results if available.
                </p>
            </div>

            {/* Content Section */}
            <div
                className="relative w-[90%] max-w-4xl p-6 rounded-lg shadow-lg"
                style={{
                    zIndex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                }}
            >
                <ActivityForm onFormSubmit={handleFormSubmit} setMode={setTransitionMode} />
            </div>

            <div
                ref={resultsRef}
                className="relative w-[90%] max-w-4xl p-6 mt-6 rounded-lg shadow-lg results-container"
                style={{
                    zIndex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    overflow: "hidden",
                    height: containerHeight, // Dynamically set height
                    transition: "height 0.5s ease",
                }}
            >
                <h2 className="text-xl font-bold mb-4">Generated Results</h2>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {generatedResults.slice(0, visibleCount).map((result, index) => (
                        <div
                            key={index}
                            style={{
                                opacity: index >= prevVisibleCount ? 0 : 1,
                                transform: index >= prevVisibleCount ? "translateY(20px)" : "none",
                                animation:
                                    index >= prevVisibleCount
                                        ? `fadeIn 0.5s ease ${(index - prevVisibleCount) * 0.1}s forwards`
                                        : "none",
                            }}
                        >
                            <li
                                className={`flex items-center justify-between p-1 px-2 rounded-lg mb-2 transition-all duration-500 transform ${index === 0
                                    ? "bg-yellow-300 text-black font-bold text-2xl hover:bg-yellow-400"
                                    : index === 1
                                        ? "bg-gray-400 text-black font-bold text-xl hover:bg-gray-500"
                                        : index === 2
                                            ? "bg-orange-400 text-black font-bold text-lg hover:bg-orange-500"
                                            : "bg-gray-700 text-white hover:bg-gray-600"
                                    }`}
                            >
                                {/* Left: Ranking Number */}
                                <div
                                    className="flex-shrink-0 text-center"
                                    style={{ width: "50px", textAlign: "center" }}
                                >
                                    <span>{index + 1}.</span>
                                </div>

                                {/* Center: Name and Description */}
                                <div className="flex-grow flex flex-col items-center text-center">
                                    <span className="font-bold">{result.name}</span>
                                    <small className="text-sm">{result.description}</small>
                                </div>

                                {/* Right: Percentage Score */}
                                <div
                                    className="flex-shrink-0 text-center"
                                    style={{ width: "70px", textAlign: "center" }}
                                >
                                    <span>{(result.score * 100).toFixed(2)}%</span>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
                {visibleCount < generatedResults.length && (
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
                        onClick={handleLoadMore}
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};
