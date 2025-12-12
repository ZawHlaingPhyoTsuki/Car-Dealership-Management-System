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
		<div className="px-6 ">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold">{title}</h1>
					<p className="text-gray-600 mt-2">{description}</p>
				</div>
				{addButton}
			</div>
			{children}
		</div>
	);
}
