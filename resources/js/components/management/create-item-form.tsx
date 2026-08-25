import { useState } from 'react';

export type CreatorRole = 'educator' | 'employer';
export type ItemType = 'activity' | 'challenge';
export type ItemStatus = 'draft' | 'published';

export type CreatedItem = {
    id: number;
    title: string;
    description: string;
    type: ItemType;
    xp_value: number;
    creator_type: CreatorRole;
    creator_id: string;
    status: ItemStatus;
};
export type ActivityLibraryItem = {
    id: number;
    title: string;
    description?: string | null;
    xp_value: number;
    verification: string;
};
type Props = {
    creatorType: CreatorRole;
    creatorId: string;
    initialType: ItemType;
    activities: ActivityLibraryItem[];
    onCancel: () => void;
    onCreated: (item: CreatedItem) => void;
};

type FormErrors = {
    title?: string;
    description?: string;
    xp?: string;
    creator?: string;
};

export default function CreateItemForm({
    creatorType,
    creatorId,
    initialType,
    activities,
    onCancel,
    onCreated,
}: Props) {
    const [type, setType] = useState<ItemType>(initialType);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [xp, setXp] = useState(100);
    
    // Activity configuration
    const [category, setCategory] = useState('learning');
    const [difficulty, setDifficulty] = useState('moderate');

    const [estimatedTimeValue, setEstimatedTimeValue] = useState(2);
    const [estimatedTimeUnit, setEstimatedTimeUnit] = useState('hours');

    const [skillLevel, setSkillLevel] = useState('beginner');
    const [effort, setEffort] = useState('moderate');

    const [complexity, setComplexity] = useState('multiple-steps');
    const [studentImpact, setStudentImpact] = useState('high');

    const [verification, setVerification] = useState(
        creatorType === 'educator'
            ? 'educator-approval'
            : 'employer-approval',
    );

    const [repeatability, setRepeatability] = useState('one-time');
    const [completionType, setCompletionType] = useState('attendance');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedActivityIds, setSelectedActivityIds] =
        useState<number[]>([]);

    // Challenge configuration
    const [challengeDifficulty, setChallengeDifficulty] =
        useState('medium');

    const [challengeTime, setChallengeTime] =
        useState('one-week');

    const [challengeGoal, setChallengeGoal] =
        useState('');

    const [challengeType, setChallengeType] =
        useState('learning');

    const [rewardTypes, setRewardTypes] =
        useState<string[]>(['xp']);

    const [status, setStatus] =
        useState<ItemStatus>('draft');

    const [errors, setErrors] =
        useState<FormErrors>({});

    const selectedActivities = activities.filter((activity) =>
        selectedActivityIds.includes(activity.id),
    );

    const challengeTotalXp = selectedActivities.reduce(
        (total, activity) => total + activity.xp_value,
        0,
    );

    const validate = () => {
        const nextErrors: FormErrors = {};

        if (!title.trim()) {
            nextErrors.title = 'Title is required.';
        }

        if (!description.trim()) {
            nextErrors.description = 'Description is required.';
        }

        if (
            type === 'activity' &&
            (!Number.isFinite(xp) || xp <= 0)
        ) {
            nextErrors.xp = 'XP must be greater than 0.';
        }

        

        if (!creatorId.trim()) {
            nextErrors.creator = 'Creator information is required.';
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        onCreated({
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            type,
            xp_value:
                type === 'activity'
                    ? xp
                    : challengeTotalXp,
            creator_type: creatorType,
            creator_id: creatorId.trim(),
            status,
        });
    };

    return (
        <div className="min-h-screen bg-[#f5f2ef] p-4 md:p-8">
            <form
                onSubmit={submit}
                className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm lg:grid-cols-[1fr_340px]"
            >
                <div className="p-6 md:p-8">
                    <div className="mb-7 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-400">
                                Create {type}
                            </p>

                            <h1 className="mt-1 text-3xl font-semibold text-gray-900">
                                Configure{' '}
                                {type === 'activity'
                                    ? 'Activity'
                                    : 'Challenge'}
                            </h1>
                        </div>

                        <span className="rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 capitalize">
                            {status}
                        </span>
                    </div>

                    <Field label="Type">
                        <div className="flex gap-2">
                            <TypeButton
                                active={type === 'activity'}
                                onClick={() => setType('activity')}
                            >
                                Activity
                            </TypeButton>

                            <TypeButton
                                active={type === 'challenge'}
                                onClick={() => setType('challenge')}
                            >
                                Challenge
                            </TypeButton>
                        </div>
                    </Field>

                    <Field
                        label={
                            type === 'activity'
                                ? 'Activity title'
                                : 'Challenge title'
                        }
                    >
                        <input
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder={
                                type === 'activity'
                                    ? 'e.g. Attend Career Workshop'
                                    : 'e.g. Portfolio Sprint Challenge'
                            }
                            className={inputClass(Boolean(errors.title))}
                        />

                        {errors.title && (
                            <ErrorText>{errors.title}</ErrorText>
                        )}
                    </Field>

                    <Field label="Description">
                        <textarea
                            rows={5}
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Describe what the student needs to do."
                            className={inputClass(
                                Boolean(errors.description),
                            )}
                        />

                        {errors.description && (
                            <ErrorText>
                                {errors.description}
                            </ErrorText>
                        )}
                    </Field>
                    
                    {type === 'activity' && (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Activity category">
                                    <select
                                        value={category}
                                        onChange={(event) =>
                                            setCategory(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="learning">Learning</option>
                                        <option value="career">Career</option>
                                        <option value="networking">Networking</option>
                                        <option value="community">Community</option>
                                    </select>
                                </Field>

                                <Field label="Difficulty">
                                    <select
                                        value={difficulty}
                                        onChange={(event) =>
                                            setDifficulty(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="very-easy">Very Easy</option>
                                        <option value="easy">Easy</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="difficult">Difficult</option>
                                    </select>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Estimated completion time">
                                    <div className="grid grid-cols-[1fr_1fr] gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={estimatedTimeValue}
                                            onChange={(event) =>
                                                setEstimatedTimeValue(
                                                    Number(event.target.value),
                                                )
                                            }
                                            className={inputClass(false)}
                                        />

                                        <select
                                            value={estimatedTimeUnit}
                                            onChange={(event) =>
                                                setEstimatedTimeUnit(event.target.value)
                                            }
                                            className={inputClass(false)}
                                        >
                                            <option value="minutes">Minutes</option>
                                            <option value="hours">Hours</option>
                                            <option value="days">Days</option>
                                        </select>
                                    </div>
                                </Field>

                                <Field label="Skill level required">
                                    <select
                                        value={skillLevel}
                                        onChange={(event) =>
                                            setSkillLevel(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">
                                            Intermediate
                                        </option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Effort required">
                                    <select
                                        value={effort}
                                        onChange={(event) =>
                                            setEffort(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>
                                </Field>

                                <Field label="Task complexity">
                                    <select
                                        value={complexity}
                                        onChange={(event) =>
                                            setComplexity(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="single-step">
                                            Single Step
                                        </option>
                                        <option value="multiple-steps">
                                            Multiple Steps
                                        </option>
                                        <option value="complex">Complex</option>
                                    </select>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Student impact">
                                    <select
                                        value={studentImpact}
                                        onChange={(event) =>
                                            setStudentImpact(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>
                                </Field>

                                <Field label="Verification method">
                                    <select
                                        value={verification}
                                        onChange={(event) =>
                                            setVerification(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="automatic">Automatic</option>
                                        <option value="educator-approval">
                                            Educator Approval
                                        </option>
                                        <option value="employer-approval">
                                            Employer Approval
                                        </option>
                                    </select>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Repeatability">
                                    <select
                                        value={repeatability}
                                        onChange={(event) =>
                                            setRepeatability(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="one-time">One Time</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="repeatable">Repeatable</option>
                                    </select>
                                </Field>

                                <Field label="Completion type">
                                    <select
                                        value={completionType}
                                        onChange={(event) =>
                                            setCompletionType(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="attendance">Attendance</option>
                                        <option value="submission">Submission</option>
                                        <option value="completion">Completion</option>
                                        <option value="approval">Approval</option>
                                    </select>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Start date">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(event) =>
                                            setStartDate(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    />
                                </Field>

                                <Field label="End date">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(event) =>
                                            setEndDate(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    />
                                </Field>
                            </div>
                        </>
                    )}

                    {type === 'challenge' && (
                        <div className="space-y-5">
                            {/* 1. Challenge difficulty + expected completion time */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Challenge difficulty">
                                    <select
                                        value={challengeDifficulty}
                                        onChange={(event) =>
                                            setChallengeDifficulty(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </Field>

                                <Field label="Expected completion time">
                                    <select
                                        value={challengeTime}
                                        onChange={(event) =>
                                            setChallengeTime(event.target.value)
                                        }
                                        className={inputClass(false)}
                                    >
                                        <option value="one-day">One Day</option>
                                        <option value="one-week">One Week</option>
                                        <option value="one-month">One Month</option>
                                        <option value="semester">Semester</option>
                                        <option value="placement">Placement</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </Field>
                            </div>

                            {/* 2. Challenge goal */}
                            <Field label="Challenge goal">
                                <textarea
                                    rows={3}
                                    value={challengeGoal}
                                    onChange={(event) =>
                                        setChallengeGoal(event.target.value)
                                    }
                                    placeholder="e.g. Complete five activities"
                                    className={inputClass(false)}
                                />
                            </Field>

                            {/* 3. Challenge type */}
                            <Field label="Challenge type">
                                <select
                                    value={challengeType}
                                    onChange={(event) =>
                                        setChallengeType(event.target.value)
                                    }
                                    className={inputClass(false)}
                                >
                                    <option value="progression">Progression</option>
                                    <option value="learning">Learning</option>
                                    <option value="employment">Employment</option>
                                    <option value="event">Event</option>
                                    <option value="community">Community</option>
                                    <option value="employer-sponsored">
                                        Employer Sponsored
                                    </option>
                                    <option value="seasonal">Seasonal</option>
                                </select>
                            </Field>

                            {/* 4. Activities in this challenge */}
                            <section className="rounded-2xl border border-gray-200 p-5">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900">
                                        Activities in this challenge
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Select activities from the library.
                                    </p>
                                </div>

                                {activities.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500">
                                        No activities are available in the library.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {activities.map((activity) => {
                                            const selected =
                                                selectedActivityIds.includes(activity.id);

                                            return (
                                                <label
                                                    key={activity.id}
                                                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 ${
                                                        selected
                                                            ? 'border-purple-400 bg-purple-50'
                                                            : 'border-gray-200 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selected}
                                                            onChange={() =>
                                                                setSelectedActivityIds(
                                                                    (current) =>
                                                                        selected
                                                                            ? current.filter(
                                                                                (id) =>
                                                                                    id !==
                                                                                    activity.id,
                                                                            )
                                                                            : [
                                                                                ...current,
                                                                                activity.id,
                                                                            ],
                                                                )
                                                            }
                                                        />

                                                        <div>
                                                            <p className="font-medium">
                                                                {activity.title}
                                                            </p>

                                                            <p className="text-xs text-gray-500">
                                                                {activity.verification} verification
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="font-semibold text-purple-600">
                                                        {activity.xp_value} XP
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="mt-5 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Selected activities</span>
                                        <span>{selectedActivities.length}</span>
                                    </div>

                                    <div className="mt-2 flex justify-between font-semibold">
                                        <span>Activities total XP</span>

                                        <span className="text-purple-600">
                                            {challengeTotalXp} XP
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* 5. Challenge reward types */}
                            <Field label="Challenge reward types">
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {[
                                        ['xp', 'XP'],
                                        ['badge', 'Badge'],
                                        ['trophy', 'Trophy'],
                                        ['unlock', 'Unlock'],
                                        ['certificate', 'Certificate'],
                                        ['bonus-xp', 'Bonus XP'],
                                        [
                                            'employer-recommendation',
                                            'Employer Recommendation',
                                        ],
                                        [
                                            'leaderboard-position',
                                            'Leaderboard Position',
                                        ],
                                    ].map(([value, label]) => {
                                        const checked = rewardTypes.includes(value);

                                        return (
                                            <label
                                                key={value}
                                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        setRewardTypes((current) =>
                                                            checked
                                                                ? current.filter(
                                                                    (item) =>
                                                                        item !== value,
                                                                )
                                                                : [...current, value],
                                                        )
                                                    }
                                                />

                                                <span className="text-sm">
                                                    {label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </Field>
                        </div>
                    )}
                            

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Creator type">
                            <input
                                disabled
                                value={creatorType}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 capitalize"
                            />
                        </Field>

                        <Field label="Creator ID">
                            <input
                                disabled
                                value={creatorId}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600"
                            />

                            {errors.creator && (
                                <ErrorText>
                                    {errors.creator}
                                </ErrorText>
                            )}
                        </Field>
                    </div>
                </div>

                <aside className="flex flex-col bg-purple-100/70 p-6 md:p-8">
                    <p className="text-sm font-semibold tracking-wide text-purple-700 uppercase">
                        Gamification Engine
                    </p>

                    <div className="mt-5 rounded-2xl bg-white p-5">
                        <label className="block text-sm text-gray-500">
                            {type === 'activity'
                                ? 'XP value'
                                : 'Challenge total XP'}
                        </label>

                        {type === 'activity' ? (
                            <div className="mt-2 flex items-end gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={xp}
                                    onChange={(event) =>
                                        setXp(Number(event.target.value))
                                    }
                                    className="w-full border-0 bg-transparent p-0 text-3xl font-semibold outline-none"
                                />

                                <span className="pb-1 font-semibold text-purple-600">
                                    XP
                                </span>
                            </div>
                        ) : (
                            <div className="mt-2 flex items-end gap-2">
                                <span className="text-3xl font-semibold">
                                    {challengeTotalXp}
                                </span>

                                <span className="pb-1 font-semibold text-purple-600">
                                    XP
                                </span>
                            </div>
                        )}

                        {errors.xp && (
                            <ErrorText>{errors.xp}</ErrorText>
                        )}
                    </div>

                    <Field label="Status" className="mt-6">
                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value as ItemStatus,
                                )
                            }
                            className="w-full rounded-xl border border-white bg-white px-4 py-3"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">
                                Published
                            </option>
                        </select>
                    </Field>

                    <div className="mt-auto flex gap-3 pt-10">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 rounded-full bg-white px-5 py-3 font-medium text-gray-700"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-semibold text-white"
                        >
                            Save
                        </button>
                    </div>
                </aside>
            </form>
        </div>
    );
}

function Field({
    label,
    children,
    className = '',
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`mt-5 block ${className}`}>
            <span className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </span>

            {children}
        </label>
    );
}

function TypeButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-5 py-2 text-sm font-medium ${
                active
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-700'
            }`}
        >
            {children}
        </button>
    );
}

function ErrorText({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <p className="mt-1 text-sm font-medium text-red-600">
            {children}
        </p>
    );
}

function inputClass(error: boolean) {
    return `w-full rounded-xl border px-4 py-3 outline-none ${
        error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-200 bg-gray-50 focus:border-purple-400 focus:bg-white'
    }`;
}