import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import "../styles/categorySection.css";

function CategorySection() {
    const navigate = useNavigate();

    return (
        <section className="category-section">
            <div className="category-header">
                <h2>Browse by Category</h2>
                <p>Find books from your favorite genres and interests.</p>
            </div>

            <div className="category-grid">
                {categories.map((category) => (
                    <div
                        key={category.name}
                        className="category-card"
                        onClick={() =>
                            navigate(
                                `/browse?category=${encodeURIComponent(category.name)}`
                            )
                        }
                    >
                        <div className="category-icon">
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.display}
                                    className="category-image"
                                />
                            ) : (
                                category.icon
                            )}
                        </div>

                        <p>{category.display}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategorySection;