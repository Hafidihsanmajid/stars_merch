<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'statusCode' => 403,
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'Akses ditolak. Anda tidak memiliki hak akses administrator.',
                ],
            ], 403);
        }

        return $next($request);
    }
}
