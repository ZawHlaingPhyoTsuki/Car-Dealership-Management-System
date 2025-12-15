import type React from "react";

interface ContentWrapperProps {
	children: React.ReactNode;
	title: string;
	description?: string;
	addButton?: React.ReactNode;
}

export default function ContentWrapper({
	children,
	title,
	description,
	addButton,
}: ContentWrapperProps) {
	return (
		<div className="px-6 flex h-full flex-col">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">{title}</h1>
					{description ? (
						<p className="mt-2 text-gray-600">{description}</p>
					) : null}
				</div>
				{addButton}
			</div>

			<div className="flex-1">{children}</div>
		</div>
	);
}
