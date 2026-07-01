import { useForm, Head } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SetupPassword({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(
            route('staff.setup-password.store', {
                user: user.id,
            })
        );
    };

    return (
        <>
            <Head title="Setup Password" />

            <div className="min-h-screen flex items-center justify-center bg-stone-950">
                <form
                    onSubmit={submit}
                    className="bg-stone-900 p-8 rounded-lg w-full max-w-md"
                >
                    <h1 className="text-white text-2xl font-bold mb-2">
                        Setup Password
                    </h1>

                    <p className="text-stone-400 mb-6">
                        {user.email}
                    </p>

                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full p-3 rounded bg-black text-white pr-10"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            className="w-full p-3 rounded bg-black text-white pr-10"
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-amber-600 py-3 rounded text-black font-semibold"
                    >
                        {processing ? 'Saving...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </>
    );
}
