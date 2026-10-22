import { Link } from 'react-router-dom';
import { categoryLabel, formatDate } from '../storia/api';
import type { Post } from '../storia/types';

/** Scheda di un capitolo nell'archivio: tutta la scheda è il link */
const StoriaCard = ({ post }: { post: Post }) => (
  <Link to={`/storia/${post.slug}`} className="st-card">
    <figure className="st-card-media">
      <img
        src={post.cover.src}
        alt={post.cover.alt}
        width={post.cover.width}
        height={post.cover.height}
        loading="lazy"
        decoding="async"
      />
      <span className="st-card-season">{post.season}</span>
    </figure>
    <div className="st-card-body">
      <p className="st-meta">
        <span className="st-meta-cat">{categoryLabel(post.category)}</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>
      <h3 className="st-card-title">{post.title}</h3>
      <p className="st-card-excerpt">{post.excerpt}</p>
      <span className="st-card-more" aria-hidden="true">
        Leggi il capitolo
      </span>
    </div>
  </Link>
);

export default StoriaCard;
