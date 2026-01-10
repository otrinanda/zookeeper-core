"use client";

import { AnimalForm } from "../_components/animal-form";

export default function CreateAnimalPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <AnimalForm isEditMode={false} />
    </div>
  );
}