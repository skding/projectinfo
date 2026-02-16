import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(req: NextRequest, props: any) {
    // params.path is an array of path segments
    const params = await props.params;
    const path = params.path;
    const filePath = join(process.cwd(), 'uploads', ...path);

    try {
        const fileBuffer = await readFile(filePath);
        // Determine content type if possible, or default to application/octet-stream
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${path[path.length - 1]}"`
            }
        });
    } catch (e) {
        return new NextResponse('File not found', { status: 404 });
    }
}
