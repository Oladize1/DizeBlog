import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { usePostStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../Component/Spinner';

const EditPostPage = () => {
  const { editPost, isLoading, error, postToEdit } = usePostStore();
  const navigate = useNavigate();

  // Destructure postToEdit safely
  const { _id, title, description, content } = postToEdit || {};

  // Local state with default empty strings.
  const [editTitle, setEditTitle] = useState(title || '');
  const [editDescription, setEditDescription] = useState(description || '');
  const [editContent, setEditContent] = useState(content || '');

  // Whenever postToEdit changes, update the local state.
  useEffect(() => {
    setEditTitle(title || '');
    setEditDescription(description || '');
    setEditContent(content || '');
  }, [postToEdit, title, description, content]);

  if (isLoading) return <Spinner />;
  if (error) {
    toast(error);
    return <div>Error loading post...</div>;
  }

  const handleEditPost = async (e) => {
    e.preventDefault();
    try {
      const editted = await editPost(_id, editTitle, editDescription, editContent);
      setEditTitle('');
      setEditDescription('');
      setEditContent('');
      toast.success('Post edited successfully');
      navigate('/');
    } catch (error) {
      toast.error(error);
      if (error.response?.data?.message === 'jwt expired') {
        navigate('/login');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-center text-4xl mb-6">Edit Post</h2>
      <form
        className="flex flex-col gap-4 justify-center items-center w-full max-w-3xl mx-auto"
        onSubmit={handleEditPost}
      >
        <div className="w-full">
          <input
            type="text"
            placeholder="Title..."
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input input-lg w-full"
          />
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Description..."
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="input input-lg w-full"
          />
        </div>
        <div className="w-full">
          <Editor
            apiKey="u7l5afp21ko7qz3c4j0gsoimxzwu3hnehxzxzzpc7p503lzm"
            value={editContent}
            onEditorChange={(newContent, editor) => setEditContent(newContent)}
            init={{
              width: '100%',
              // plugins: [
              //   'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image',
              //   'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks',
              //   'wordcount', 'checklist', 'mediaembed', 'casechange', 'export',
              //   'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker',
              //   'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage',
              //   'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents',
              //   'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss',
              //   'markdown','importword', 'exportword', 'exportpdf'
              // ],
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              tinycomments_mode: 'embedded',
              tinycomments_author: 'Author name',
              mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4 w-full">
          Edit Post
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
