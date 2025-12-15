import NotFoundPageClient from "@/components/not-found/not-found-page";

export const metadata = {
    title: '404 - Page Not Found',
    description: "The page you're looking for doesn't exist.",
};

export default function NotFoundPage() {
    return <NotFoundPageClient />;
}
