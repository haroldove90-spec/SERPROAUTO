import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.443-7.243A1.012 1.012 0 017.5 4.001h9a1.012 1.012 0 01.964.638l4.443 7.243a1.012 1.012 0 010 .639l-4.443 7.243a1.012 1.012 0 01-.964.638h-9a1.012 1.012 0 01-.964-.638L2.036 12.322z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(username, password);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-kia-dark p-4">
            <div className="w-full max-w-md">
                <div className="p-8 space-y-8 bg-black rounded-lg shadow-lg">
                    <div className="text-center">
                        <img src="https://serproauto.com.mx/wp-content/uploads/2025/03/SERPROAUTO.png" alt="SERPROAUTO Logo" className="w-48 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-kia-light">Iniciar Sesión</h2>
                        <p className="mt-2 text-sm text-kia-gray">Bienvenido al Dashboard de SERPROAUTO</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <Input
                            id="username"
                            label="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <Input
                            id="password"
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            endAdornment={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-kia-gray hover:text-kia-light focus:outline-none"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword
                                        ? <EyeSlashIcon className="h-5 w-5" />
                                        : <EyeIcon className="h-5 w-5" />
                                    }
                                </button>
                            }
                        />
                        
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <div>
                            <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                                {isLoading ? 'Ingresando...' : 'Ingresar'}
                            </Button>
                        </div>
                    </form>
                </div>
                
                <div className="mt-6 p-4 border border-kia-dark-2 rounded-lg text-xs text-kia-gray space-y-2 bg-black shadow-lg">
                    <h4 className="font-bold text-sm text-center text-kia-light mb-3">Credenciales de Prueba</h4>
                    <p><span className="font-semibold text-kia-light">Jefe de Taller:</span><br/> <span className="font-mono text-kia-primary">usuario:</span> jefetaller | <span className="font-mono text-kia-primary">clave:</span> jefetaller123</p>
                    <hr className="border-gray-700 my-2"/>
                    <p><span className="font-semibold text-kia-light">Asesor:</span><br/> <span className="font-mono text-kia-primary">usuario:</span> asesor | <span className="font-mono text-kia-primary">clave:</span> asesor123</p>
                     <hr className="border-gray-700 my-2"/>
                    <p><span className="font-semibold text-kia-light">Mecánico:</span><br/> <span className="font-mono text-kia-primary">usuario:</span> mecanico | <span className="font-mono text-kia-primary">clave:</span> mecanico123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;