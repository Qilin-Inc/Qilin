import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable, CanActivate, Logger, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
    private readonly logger = new Logger(ClerkAuthGuard.name);

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const cookies = request.cookies; // Get all cookies
        this.logger.log('Cookies received:', cookies); // Log all cookies

        const token = cookies.__session; // Retrieve the token from the correct cookie

        if (!token) {
            this.logger.error('No token found in cookies');
            return false; // Deny access if no token is found
        }

        try {
            await clerkClient.verifyToken(token); // Verify the token
        } catch (err) {
            this.logger.error('Token verification failed', err); // Log the error
            return false; // Deny access if token verification fails
        }

        return true; // Allow access if token is valid
    }
}
